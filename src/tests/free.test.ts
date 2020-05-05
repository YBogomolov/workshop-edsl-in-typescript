import { foldFree } from 'fp-ts-contrib/lib/Free';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { execState, State, state } from 'fp-ts/lib/State';

import { coolPost, john } from '../domain';
import { DB, getNextId } from '../utils/db';
import { ProgramF } from '../workshop/free-monads/api';
import { exampleProgram1, exampleProgram2, exampleProgram3 } from '../workshop/free-monads/examples';

interface TestState {
  readonly db: DB;
  readonly cache: Map<string, string>;
}

type Interpreter = <A>(program: ProgramF<A>) => State<TestState, A>;

const stateInterpreter: Interpreter = (program) => {
  return ({ db, cache }) => {
    switch (program.tag) {
      case 'KVGet': return [program.next(O.fromNullable(cache.get(program.key))), { db, cache }];
      case 'KVPut': return [program.next(true), { db, cache: cache.set(program.key, program.value) }];
      case 'KVDelete': return [program.next(cache.delete(program.key)), { db, cache }];

      case 'DBGetPosts': return [program.next(Object.values(db[program.userId])), { db, cache }];
      case 'DBCreatePost': {
        const id = getNextId(db, program.post.author.id);
        const newPost = { ...program.post, id, };
        db[program.post.author.id] = db[program.post.author.id] || {};
        db[program.post.author.id][id] = newPost;

        return [program.next(newPost), { db, cache }];
      }
      case 'DBUpdatePost': return pipe(
        O.fromNullable(db[program.update.author.id][program.postId]),
        O.fold(
          () => [program.next(O.none), { db, cache }],
          (existingPost) => {
            const updatedPost = { ...existingPost, ...program.update };
            db[program.update.author.id][program.postId] = updatedPost;

            return [program.next(O.some(updatedPost)), { db, cache }];
          },
        ),
      );

      case 'NetSend': return [program.next(), { db, cache }];
    }
  };
};

describe('Free monads', () => {
  it('Example 1: Get a list of user posts, cache and send them for a review', () => {
    const initialState: TestState = {
      db: {
        [john.id]: {
          [coolPost.id]: coolPost,
        },
      },
      cache: new Map(),
    };

    const nextState = execState(
      foldFree(state)(stateInterpreter, exampleProgram1(john.id)),
      initialState,
    );

    const cachedPost = nextState.cache.get(`${john.id}`);
    expect(cachedPost).toBeDefined();
    expect(cachedPost).toStrictEqual(JSON.stringify([coolPost]));
  });

  it('Example 1: should not make a trip to DB when posts are cached', () => {
    const initialState: TestState = {
      db: {},
      cache: new Map([[`${john.id}`, JSON.stringify([coolPost])]]),
    };
    const mockInterpreter = jest.fn(stateInterpreter);

    const nextState = execState(
      foldFree(state)(mockInterpreter as Interpreter, exampleProgram1(john.id)),
      initialState,
    );

    expect(mockInterpreter).toBeCalledTimes(2);
    expect(nextState).toStrictEqual(initialState);
  });

  it(`Example 2: Create a post and send top-3 to author's email`, () => {
    const initialState: TestState = {
      db: {},
      cache: new Map(),
    };

    const nextState = execState(
      foldFree(state)(stateInterpreter, exampleProgram2(coolPost)),
      initialState,
    );
    expect(nextState.db).toStrictEqual({ [john.id]: { [coolPost.id]: coolPost } });
  });

  it('Example 3: Update a post, invalidate cache if required and return the results', () => {
    const initialState: TestState = {
      db: {
        [john.id]: {
          [coolPost.id]: { ...coolPost, body: 'Some old and rusty text' },
        },
      },
      cache: new Map([[`${john.id}`, JSON.stringify([coolPost])]]),
    };

    const nextState = execState(
      foldFree(state)(stateInterpreter, exampleProgram3(coolPost.id, coolPost)),
      initialState,
    );

    expect(nextState).toStrictEqual({
      db: {
        [john.id]: {
          [coolPost.id]: coolPost,
        },
      },
      cache: new Map(),
    });
  });
});

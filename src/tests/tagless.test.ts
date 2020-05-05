import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { execState, State, state } from 'fp-ts/lib/State';

import { coolPost, john } from '../domain';
import { DB, getNextId } from '../utils/db';
import { Program } from '../workshop/tagless-final/api';
import { exampleProgram1, exampleProgram2, exampleProgram3 } from '../workshop/tagless-final/examples';

interface TestState {
  readonly db: DB;
  readonly cache: Map<string, string>;
}

const URI = 'InterpreterState';
type URI = typeof URI;
type InterpreterState<A> = State<TestState, A>;

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    InterpreterState: InterpreterState<A>;
  }
}

const stateInterpreter: Program<URI> = {
  ...state,
  URI,
  kvGet: (key) => ({ db, cache }) => [O.fromNullable(cache.get(key)), { db, cache }],
  kvPut: (key, value) => ({ db, cache }) => [cache.set(key, value) != null, { db, cache }],
  kvDelete: (key) => ({ db, cache }) => [cache.delete(key), { db, cache }],

  getPosts: (userId) => ({ db, cache }) => [Object.values(db[userId]), { db, cache }],
  createPost: (post) => ({ db, cache }) => {
    const id = getNextId(db, post.author.id);
    const newPost = { ...post, id };
    db[post.author.id] = db[post.author.id] || {};
    db[post.author.id][id] = newPost;
    return [newPost, { db, cache }];
  },
  updatePost: (postId, update) => ({ db, cache }) => [pipe(
    O.fromNullable(db[update.author.id][postId]),
    O.map(
      existingPost => {
        const updatedPost = { ...existingPost, ...update };
        db[update.author.id][postId] = updatedPost;
        return updatedPost;
      },
    ),
  ), { db, cache }],

  netSend: (_payload, _address) => ({ db, cache }) => [undefined, { db, cache }],
};

describe('Tagless Final', () => {
  it('Example 1: Get a list of user posts, cache and send them for a review', () => {
    const initialState: TestState = {
      db: {
        [john.id]: {
          [coolPost.id]: coolPost,
        },
      },
      cache: new Map(),
    };

    const nextState = execState(exampleProgram1(stateInterpreter)(john.id), initialState);
    const cachedPost = nextState.cache.get(`${john.id}`);

    expect(cachedPost).toBeDefined();
    expect(cachedPost).toStrictEqual(JSON.stringify([coolPost]));
  });

  it('Example 1: should not make a trip to DB when posts are cached', () => {
    const initialState: TestState = {
      db: {},
      cache: new Map([[`${john.id}`, JSON.stringify([coolPost])]]),
    };
    const getPostsSpy = jest.spyOn(stateInterpreter, 'getPosts');

    const nextState = execState(exampleProgram1(stateInterpreter)(john.id), initialState);

    expect(getPostsSpy).not.toBeCalled();
    expect(nextState).toStrictEqual(initialState);
  });

  it(`Example 2: Create a post and send top-3 to author's email`, () => {
    const initialState: TestState = {
      db: {},
      cache: new Map(),
    };

    const nextState = execState(exampleProgram2(stateInterpreter)(coolPost), initialState);

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

    const nextState = execState(exampleProgram3(stateInterpreter)(coolPost.id, coolPost), initialState);

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
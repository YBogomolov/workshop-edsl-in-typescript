/*
Here you'll write concrete interpreters for your eDSL, which will translate it to the specific monad
*/

import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';

import { DBPost, john } from '../../domain';

import { ProgramF } from './api';

// type Interpreter = ProgramF ~> Task
export const getTaskInterpreter = () => {
  const cache = new Map<string, string>();
  const dbFake: Record<number, Record<number, DBPost>> = {
    1: {
      1: { id: 1, title: 'First post', body: 'Look at this <b>cooool</b> post', tags: ['cool'], author: john },
      2: { id: 2, title: 'Second post', body: 'Look at this even <b>cooooler</b> post', tags: ['cool'], author: john },
    },
  };

  return <A>(program: ProgramF<A>): T.Task<A> => {
    switch (program.tag) {
      case 'KVGet': return T.task.fromIO(() => program.next(O.fromNullable(cache.get(program.key))));
      case 'KVPut': return T.task.fromIO(() => program.next(cache.set(program.key, program.value) != null));
      case 'KVDelete': return T.task.fromIO(() => program.next(cache.delete(program.key)));

      case 'DBGetPosts': return T.delay(400)(T.task.fromIO(() => program.next(Object.values(dbFake[program.userId]))));
      case 'DBCreatePost': {
        const userPostDb = dbFake[program.post.author.id];
        const id = Math.max(...Object.keys(userPostDb).map(k => +k)) + 1;
        const newPost = { ...program.post, id };
        dbFake[program.post.author.id][id] = newPost;
        return T.delay(150)(T.task.fromIO(() => program.next(newPost)));
      }
      case 'DBUpdatePost': return T.delay(200)(pipe(
        O.fromNullable(dbFake[program.update.author.id][program.postId]),
        O.fold(
          () => T.task.of(program.next(O.none)),
          (existingPost) => {
            const updatedPost = { ...existingPost, ...program.update };
            dbFake[program.update.author.id][existingPost.id] = updatedPost;
            return T.task.fromIO(() => program.next(O.some(updatedPost)));
          },
        ),
      ));

      case 'NetSend': return T.delay(1500)(T.task.fromIO(() => program.next()));
    }
  };
};

export const logger = <A>(program: ProgramF<A>): ProgramF<A> => {
  const { tag, ...rest } = program;
  console.log(`[${tag}]`, JSON.stringify(rest));
  return program;
};
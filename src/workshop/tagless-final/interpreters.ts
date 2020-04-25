/*
Here you'll write concrete interpreters for your eDSL, which will translate it to the specific monad
*/

import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';

import { DBPost, john } from '../../domain';

import { Program } from './api';

// * Interpreters

// Task interpreter

export const getTaskInterpreter = (): Program<T.URI> => {
  const dbFake: Record<number, DBPost> = {
    1: { id: 1, title: 'A cool post', body: '<h1>SEE THAT!</h1>', tags: ['cool'], author: john },
    2: { id: 2, title: 'Cooler post', body: '<h1>SEE THIS!</h1>', tags: ['cool'], author: john },
  };
  const cache = new Map<string, string>();

  return {
    ...T.task,
    kvGet: (key) => async () => O.fromNullable(cache.get(key)),
    kvPut: (key, value) => async () => cache.set(key, value) != null,
    kvDelete: (key) => async () => cache.delete(key),

    getPosts: (_userId) => async () => Object.values(dbFake),
    createPost: (post) => async () => {
      const id = Math.max(...Object.keys(dbFake).map(k => +k)) + 1;
      dbFake[id] = { ...post, id };
      return dbFake[id];
    },
    updatePost: (postId, update) => pipe(
      O.fromNullable(dbFake[postId]),
      O.fold(
        () => T.task.of(O.none),
        (existingPost) => {
          dbFake[existingPost.id] = {
            ...existingPost,
            ...update,
          };
          return T.task.fromIO(() => O.some(dbFake[existingPost.id]));
        },
      ),
    ),

    netSend: (_payload) => T.delay(500)(T.of(void 0)),
  };
};

// Logging interpreter

export const logger = (taskI: Program<T.URI>): Program<T.URI> => ({
  ...taskI,
  kvGet: (key) => {
    console.log(`[kvGet]`, JSON.stringify({ key }));
    return taskI.kvGet(key);
  },
  kvPut: (key, value) => {
    console.log(`[kvPut]`, JSON.stringify({ key, value }));
    return taskI.kvPut(key, value);
  },
  kvDelete: (key) => {
    console.log(`[kvDelete]`, JSON.stringify({ key }));
    return taskI.kvDelete(key);
  },
  getPosts: (userId) => {
    console.log(`[getPosts]`, JSON.stringify({ userId }));
    return taskI.getPosts(userId);
  },
  createPost: (post) => {
    console.log(`[createPost]`, JSON.stringify({ post }));
    return taskI.createPost(post);
  },
  updatePost: (postId, update) => {
    console.log(`[updatePost]`, JSON.stringify({ postId, update }));
    return taskI.updatePost(postId, update);
  },
  netSend: (payload, address) => {
    console.log(`[netSend]`, JSON.stringify({ payload, address }));
    return taskI.netSend(payload, address);
  },
});
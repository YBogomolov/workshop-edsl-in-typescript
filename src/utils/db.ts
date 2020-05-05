import { Post } from '../domain';

export type DB = Record<number, Record<number, Post>>;

export const getNextId = (db: DB, authorId: number): number => {
  const userPost = db[authorId];
  const id = Math.max(Math.max(...Object.keys(userPost || {}).map(k => +k)) + 1, 1);
  return id;
};

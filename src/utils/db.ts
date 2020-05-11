import { DBPost, User } from '../domain';

export type DB = Record<User['id'], Record<DBPost['id'], DBPost>>;

export const getNextId = (db: DB, authorId: number): number => {
  const userPosts = db[authorId];
  const id = Math.max(Math.max(...Object.keys(userPosts || {}).map(k => +k)) + 1, 1);
  return id;
};

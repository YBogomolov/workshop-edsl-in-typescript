import { Post, PostUpdate } from '../../domain';
import { notImplemented } from '../../utils/throw';

/*
Here you'll write API for the eDSL – a set of operations which represent your core domain logic

Our domain requires the following set of operations:

* KV Store *

kvGet    : (key: string) => Option<string>
kvPut    : (key: string, value: string) => boolean
kvDelete : (key: string) => boolean

* Database *

getPosts   : (userId: number) => Post[]
createPost : (post: PostWithoutId) => Post
updatePost : (postId: number, update: PartialPost) => Post

* Network *

netSend : <T>(payload: T, email: string) => void
*/

// * API

/**
 * Tries to get user's posts from cache, returns either `none` in case of cache miss,
 * and `some` in case of hit.
 *
 * @param userId User ID for which we want to get cached posts
 */
export const cacheGetPosts =
  (userId: number) => notImplemented();

/**
 * Stores a list of posts of the given user (identified by `userId`) in the cache.
 *
 * @param userId User ID – a will be used as a key for cache
 * @param posts A list of posts to store in cache
 */
export const cacheStorePosts =
  (userId: number, posts: Post[]) => notImplemented();

/**
 * Clears cache for a given user ID.
 *
 * @param userId User ID
 */
export const cacheInvalidate =
  (userId: number) => notImplemented();

/**
 * Gets a list of posts belonging to the given user (identified by `userId`).
 *
 * @param userId User ID – author of posts
 */
export const dbGetPosts =
  (userId: number) => notImplemented();

/**
 * Stores post in the database.
 *
 * @param post Post data to store in the DB
 */
export const dbCreatePost =
  (post: Post) => notImplemented();

/**
 * Updated a post in the database, identified by its ID.
 *
 * @param postId Post ID
 * @param update A set of updated fields for this post ID
 */
export const dbUpdatePost =
  (postId: number, update: PostUpdate) => notImplemented();

/**
 * Sends a list of posts via network.
 *
 * @param posts A list of posts to send via network
 * @param to Email to send these `posts` to.
 */
export const netSendPosts =
  (posts: Post[], to: string) => notImplemented();

/**
 * **Bonus points**: implement a `getInstanceFor` method. Think what `P` parameter might be?
 */
export const getInstanceFor = (P: unknown) => {
  return {
    // ???
  };
};
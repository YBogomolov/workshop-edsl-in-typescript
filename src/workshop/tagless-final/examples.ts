import { Post } from '../../domain';
import { notImplemented } from '../../utils/throw';

// * Write the following:

// 1. Get a list of user posts, cache and send them to 'review@example.com' for a review
export const exampleProgram1 =
  (userId: number) => notImplemented();

// 2. Create a post and send top-3 to author's email
export const exampleProgram2 =
  (newPost: Post) => notImplemented();

// 3. Update a post, invalidate the cache if required and return the updated post
export const exampleProgram3 =
  (postId: number, update: Post) => notImplemented();

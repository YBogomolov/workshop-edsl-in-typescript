// * Write the following:

import { Free } from 'fp-ts-contrib/lib/Free';
import { Option } from 'fp-ts/lib/Option';

import { Post, PostUpdate } from '../../domain';
import { notImplemented } from '../../utils/throw';

// 1. Get a list of user posts, cache and send them to 'review@example.com' for a review
export const exampleProgram1 =
  (userId: number): Free<'???', void> => notImplemented();

// 2. Create a post and send top-3 to author's email
export const exampleProgram2 =
  (newPost: Post): Free<'???', void> => notImplemented();

// 3. Update a post, invalidate the cache if required and return the updated post
export const exampleProgram3 =
  (postId: number, update: PostUpdate): Free<'???', Option<Post>> => notImplemented();
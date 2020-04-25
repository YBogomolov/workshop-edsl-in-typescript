import { Do } from 'fp-ts-contrib/lib/Do';
import * as F from 'fp-ts-contrib/lib/Free';
import { Free } from 'fp-ts-contrib/lib/Free';
import * as O from 'fp-ts/lib/Option';
import { Option } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

import { Post, PostUpdate } from '../../domain';

import * as Api from './api';

// 1. Get a list of user posts, cache and send them to 'review@example.com' for a review
export const exampleProgram1 =
  (userId: number): Free<Api.ProgramFURI, void> => Do(F.free)
    .bind('cachedPosts', Api.cacheGetPosts(userId))
    .bindL('posts', ({ cachedPosts }) => pipe(
      cachedPosts,
      O.fold(
        () => F.free.chain(
          Api.dbGetPosts(userId),
          posts => F.free.map(
            Api.cacheStorePosts(userId, posts),
            () => posts,
          ),
        ),
        posts => F.free.of(posts),
      ),
    ))
    .bindL('net', ({ posts }) => Api.netSendPosts(posts, 'review@example.com'))
    .return(({ net }) => net);

// 2. Create a post and send top-3 to author's email
export const exampleProgram2 =
  (newPost: Post): Free<Api.ProgramFURI, void> => Do(F.free)
    .bind('post', Api.dbCreatePost(newPost))
    .bindL('top3Posts', ({ post }) => F.free.map(
      Api.dbGetPosts(post.author.id),
      (allPosts) => allPosts.slice(0, 3),
    ))
    .bindL('net', ({ top3Posts, post }) => Api.netSendPosts(top3Posts, post.author.email))
    .return(({ net }) => net);

// 3. Update a post, invalidate the cache if required and return the updated post
export const exampleProgram3 =
  (postId: number, update: PostUpdate): Free<Api.ProgramFURI, Option<Post>> => Do(F.free)
    .bind('maybeUpdate', Api.dbUpdatePost(postId, update))
    .bindL('post', ({ maybeUpdate }) => pipe(
      maybeUpdate,
      O.fold(
        () => F.free.of(maybeUpdate),
        (updated) => F.free.map(
          Api.cacheInvalidate(updated.author.id),
          () => maybeUpdate,
        ),
      ),
    ))
    .return(({ post }) => post);
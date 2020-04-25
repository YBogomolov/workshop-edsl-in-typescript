/**
 * This file represents our domain model - blogging platform with users and posts.
 */

import { AtLeastOne } from '../utils/atLeastOne';

/**
 * User of our system – just a simple collection of fields
 */
export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

/**
 * Blog post in our domain, authored by some user
 */
export interface Post {
  readonly title: string;
  readonly body: string;
  readonly tags: string[];
  readonly author: User;
}

/**
 * A representation of a post in the database. Contains an `id` obtained from the DB.
 */
export type DBPost = Post & {
  readonly id: number;
};

/**
 * A convenience alias for a post update model.
 *
 * Contains a required field – `author` and at least one other field – `title`, `body` or `tags` – as required
 *
 * @example
 * const update1: PostUpdate = { author: john }; // ❌ ts(6133)
 * const update2: PostUpdate = { author: john, title: 'New post' } // ✅
 * const update3: PostUpdate = { author: john, body: 'A new post!' } // ✅
 * const update4: PostUpdate = { author: john, tags: ['funny'] } } // ✅
 */
export type PostUpdate = AtLeastOne<Partial<Omit<Post, 'author'>>> & Pick<Post, 'author'>;

// An example data for testing purposes

export const john: User = { id: 1, name: 'John Smith', email: 'john.smith@example.com' };

export const coolPost: Post = { title: 'Cool', body: 'Post', tags: [], author: john };

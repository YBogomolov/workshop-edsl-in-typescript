# Building eDSLs in functional TypeScript

Business logic could be expressed in a limited subset of host language, leading to correct by construction, robust, optimisable code. This process is known as building eDSL – embedded domain-specific languages – and interpreting them, and is a widely used practice in functional languages like Haskell, Scala, OCaml. Still, this topic is terra incognita for many JS/TS developers.

During this workshop I will give an overview of two ways of building eDSLs in functional TypeScript using [fp-ts](https://github.com/gcanti/fp-ts) library:
1. Free Monads
2. Tagless Final

## Goals of this workshop

1. Introduce you to a concept of “effect abstraction”, allowing dynamic replacement of effects depending on the requirements.
2. Give you two new instruments for separating the business logic from a concrete effect — Free monads and Tagless Final style.
3. Provide you with a hands-on experience of using eDSLs as a pattern.

More specifically, you'll write a set of functions for out business domain — blogging platform, — use them to express a few simple programs and finally write an interpreter, which will do the actual execution of the code.

## Business domain

You're writing a REST API for a blogging platform, in which you have two entities: a user and a post.

A user is described by this interface:

```ts
interface User {
  readonly name: string;
  readonly email: string;
}
```

And the blog post is defined as this:

```ts
interface Post {
  readonly title: string;
  readonly body: string;
  readonly tags: string[];
  readonly author: User;
}
```

These two entities are stored in the relational database — PostgreSQL, MySQL, MSSQL, you name it — and are cached in some kind of key-value storage — Redis, KeyDB, memcached, etc. Your goal is to represent the commonly-used operations over those storages and network as a high-level composable API.

### Requirements

- A notebook with code editor OR browser with CodeSandbox.
- Working Node.js 10+ environment.
- Downloaded workshop template (this repository).
- Understanding basic concepts of functional programming: immutability, totality, purity, function composition, least power principle, etc.
- Understanding what a monad and a functor are.

If you want to prepare for this workshop better, I highly recommend reading these articles:
1. An overview of FP terminology with `fp-ts`: https://medium.com/@steve.hartken/typescript-and-fp-ts-terminology-da6ea5d30bdc
2. How higher-kinded types work in `fp-ts`: https://dev.to/urgent/fp-ts-hkt-and-higher-kinded-types-in-depth-1ila
3. An example of how to use Do-notation: https://gcanti.github.io/fp-ts-contrib/modules/Do.ts.html

## How to use this repository

1. Clone it to your local computer.
2. Install all the dependencies using `npm ci`.
3. Open the repository in editor of your choice and follow along with the explanations.
4. If you stuck, feel free to use one of recovery points (see below) to catch-up.

Recovery points are branches with implemented crucial for understaning the material checkpoints. Their names are:
- 01-free-api
- 02-free-example
- 03-free-interpreters
- 04-tagless-api
- 05-tagless-examples
- 06-tagless-interpreters

## Further reading

When it comes to functional programming in TypeScript, there's not many resources I can recommend with confidence, but these two are really good:
1. Articles from `fp-ts` creator Giulio Canti on dev.to: https://dev.to/gcanti
2. Awesome cource by Brian Lonsdorf: https://github.com/MostlyAdequate/mostly-adequate-guide

Also if you want to read in more details about Free monads and Tagless Final, I recommend reading these articles:
1. Typed Tagless Final Interpreters by Oleg Kiselyov: http://okmij.org/ftp/tagless-final/course/lecture.pdf
2. Free monads for cheap interpreters: https://www.tweag.io/posts/2018-02-05-free-monads.html

And if you want to dive deeper in interpretation and optimization, I recommend reading more about Free applicatives: https://arxiv.org/pdf/1403.0749.pdf

## Contacts

Created by [Yuriy Bogomolov](mailto:yuriy.bogomolov@gmail.com).

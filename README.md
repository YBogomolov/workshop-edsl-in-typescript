## Building eDSLs in functional TypeScript

Business logic could be expressed in a limited subset of host language, leading to correct by construction, robust, optimisable code. This process is known as building eDSL – embedded domain-specific languages – and interpreting them, and is a widely used practice in functional languages like Haskell, Scala, OCaml. Still, this topic is terra incognita for many JS/TS developers.

During this workshop I will give an overview of two ways of building eDSLs in functional TypeScript using [fp-ts](https://github.com/gcanti/fp-ts) library:
1. Free Monads
2. Tagless Final

### Requirements

- A notebook with code editor OR browser with CodeSandbox.
- Working Node.js 10+ environment.
- Downloaded workshop template (this repository).
- Understanding basic concepts of functional programming: immutability, totality, purity, function composition, least power principle, etc.
- Understanding what a monad and a functor are.

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

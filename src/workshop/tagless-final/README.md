# Finally tagless, partially evaluated

Tagless Final should be perceived as a functional design pattern. In its core lies an idea of abstracting a concrete effect away from the computation, and delay interpretation into a concrete effect as much as possible.

## Tagged vs. tagless

We call a *tagged* encoding that which required construction of an object in order to represent the computations. In this sense free monads should be considered as a *tagged* encoding.

We call a *tagless* encoding that which does not require creation of a new object while representing computations.

## Initial vs. final

Strictly speaking, *initial* encoding means that an entity is defined by the way it's *constructed*, and *final* encoding means that an entity is defined by the way it's *consumed* (eliminated, viewed, computed).

## Further reading

To read the original papers about Typed Tagless Final interpreters, please visit Oleg Kiselyov's website: http://okmij.org/ftp/tagless-final/index.html
---
title: Designing and Implementing Value Semantic Interface in Swift
category: Programming
tags: [Swift, Value Semantics]
isPublished: false
---

## Understanding Value Semantics

"Value semantics", and its corresponding terminology "reference semantics",
can be often heard in development communities of modern programming
languages. Maybe for the word "semantics" is not frequently used in daily
life, there are many posts explain what does "value semantics"
and "reference semantics" mean, which typically illustrates the difference
between these two concepts with code like:

```swift
// Value semantics
struct Foo {
    var value: Int = 0
}

var a = Foo()
let b = a

a.value = 10

print("\(a.value)") // prints 10
print("\(b.value)") // prints 0
```

```swift
// Reference semantics
class Foo {
    var value: Int = 0
    init() {}
}

let a = Foo()
let b = a

a.value = 10

print("\(a.value)") // prints 10
print("\(b.value)") // prints 10
```

Yes, this is a typical example illustrates the result of the differences
between applying value semantics and reference semantics to an identical
computational procedure:

```swift
a.value = 10
```

But why there is value semantics and reference semantics?

If we don't know how it comes to be like that, then we are not able to
figure out where to push it to the next stage.

Look into the following code:

```swift
func increase(_ x: Int) -> Int {
    return x + 1
}

let a: Int = 0
let b: Int = increase(a)
let c: Int = increase(b)
```

We can observe that the results of calling function `increase(_:)` are
independent from each other by assigning to a variable of value semantics.

Sometimes we need this independency in our system design, but sometimes we
just want the results of calling a function accumulate on a single place.

Look into the following code:

```swift
class Context {
    var value: Int
    init() { value = 0 }
}

func increase(_ contex: Context) {
    context.value += 1
}

let context = Context()

increase(context)
increase(context)
```

In the example above, the results of calling function `increase(_:)` are
accumulated on the `value` property of the `context` object by exercising
variable `context` of reference semantics.

In many cases, we want this kind of effect, such as holding a shared manager
object to manage undo/redo stack, holding a controller object to synchronize
view appearance changes with user interactions or holding a buffer to load a
mount of data.

Intuitively, we can spot that the difference between two examples above
is to share or not to share data among computational procedures.

Yes, __this__ is the key to understand value semantics and reference
semantics -- adopting value semantics means to not share data among
computational procedures while adopting reference semantics means to share
data among computational procedures.

You may wonder that, the term "Value Semantics" on Wikipedia was written
that:

> In computer science, having value semantics (also value-type semantics or copy-by-value semantics) means for an object that only its value counts, not its identity.

and has nothing to do with sharing or not-sharing data among computational
procedures.

Actually, sharing data enforces us to identify the shared object while not
to share data doesn't come with this enforcement. So the definition of
value semantics on Wikipedia doesn't violet what I mentioned above.

## Implementations of Value Semantics

Adopting value semantics or reference semantics in Swift is quite easy:
mark your type with `struct` when you want a type to be of value semantics,
and `class` when you want a type to be of reference semantics.

But how does each semantics work "under-the-hood"?

In previous section, we have established a basic understanding upon value
semantics and reference semantics with the language primitives of Swift:
`struct` and `class`. But how does it work internally?

## Value Semantics on Swift

## Value Semantics on Orgainzation

---

And the key to implement sharing or not sharing is to implement a mechanism
not to copy or to copy while assigning values or passing parameters, while
the actual data copying process may not happen immediately when a copy was
invoked.

### Benefits of Value Semantics

#### Physical Isolation of Team Work

#### Less Code Than Mutable/Immutable Pattern

#### Born for Functional Programming

### Cost of Value Semantics

#### Cost of Copying

#### Cost of Isolation of Team Work

## Implementaing Value Semantics

### Two Approaches

#### Combining Value Semantics Members

#### Building Another Level of Indirection

### Optimization with Copy-on-Write

### Optimization for "Monolithic" Data Structure

## Tips for Designing Value Semantics Interface

### Moving Business Logic to a Dedicated Object

### Only Do Sanity Check in Your Value Type

### Interpreting Rather Than Exposing Internal Data Structure
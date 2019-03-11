---
title: A Story of Implementing Aspect-Oriented Programming in Objective-C and Swift
category: Programming
tags: [Swift, Objective-C, 'Aspect-Oriented Programming']
---

## Case Study: Intervening UIScrollView Instances's Pan Gesture Recognizer

As we known, `UIScrollView` translates pan gesture signals into
`scrollViewDidXXX:` messages and sends to its delegate, most of the time
you only have to understand the relationships between the pan gesture
signals and the `scrollViewDidXXX:` messages and then listen to these
signals in the delegate. But what if you want to intervene the pan gesture
recognizer's work? I mean, to intervene the handling of pan gesture's
recognition.

Here, if we don't modify the internal mechanism of `UIScrollView`, we
have to make a subclass.

`UIScrollView`'s pan gesture recognizer solidates its delegate to be the
owning `UIScrollView` instance itself. If you set its delegate to another
"man in-the-middle", you would get a runtime exception. Most people would
come up with subclassing here, but what if you are expecting this
modification may affect some instances of subclasses inherited to
`UIScrollView` at some point?

In object-oriented programming paradigm, modifying the internal mechanism
of an existed class is not encouraged. Since object-oriented programming
builds upon continuously making **is-a** assertions -- what a class do
make the reason why this class **is** the class itself, then one of the
core concepts of object-oriented programming is to extend but not modify.
Modifying the internal mechanism of an existed class just breaks the
paradigm. If you modified it, the **is-a** assertion torn down and the
foundation of software architecture swinged.

So, don't be cult of whatever-oriented programming forever. This time you
need aspect-oriented programming. With it, you don't have to create a new
class from `UIView` but also can achieve the goal of intervening the pan
gesture recognizer's work and this intervention can affect the subclasses
inherited to `UIScrollView`.

## Aspect-Oriented Programming Introduction

Aspect-oriented programming probably is one of those terms which are
explained the most over-complicated in the programming world.

The most similar thing compared to aspect-oriented programming I think is
plant grafting.

Plant grafting means to fix a shoot or twig to a slit of the trunk or
stem of a living plant, such that the shoot or twig can receive sap from
the living plant and continue to grow up.

![Plant Grafting](plant-grafting.png 'Plant Grafting')

Aspect-oriented programming is quite like plant grafting.

![Plant Grafting v.s. AOP](plant-grafting-vs-aop.png 'Plant Grafting v.s. AOP')

As the above figure shown, aspect-oriented programming concerns about
three things:

- The added code
- The aspect
- The manipulated object

We can take the **added code** in aspect-oriented programming as **twig**
in plant grafting, the **aspect** as the **slit** and the
**manipulated object** as the **living plant**. Then aspect-oriented
programming is **to fix** these three things together.

## Existed Aspect-Oriented Programming in Objective-C and Swift

There is a misunderstanding about aspect-oriented programming in
Objective-C: aspect-oriented programming is not officially supported by
Apple.

No.

Key-Value Observation is just an ad-hoc aspect-oriented programming
framework in Objective-C and is an official feature shipped by Apple. We
can plug Key-Value Observation in previous plant grafting model:

- The property changes event triggers of a key-value observed object's
  are the twig (new code).

- An observable property is the slit (aspect).

- A key-value observed object is the living plant (manipulated object).

Thus we can know that Key-Value Observation is of aspect-oriented
programming, but its "aspect" is "ad-hoc" and what Apple don't officially
support is a "general" aspect support to aspect-oriented programming.

Aspect-oriented programming in Swift is complicated. With the legacy of
Objective-C, Swift supports Key-Value Observation by default. But since
dispatches of function calls can be potentially resolved at compile time
and are written to the compiled products, and Key-Value Observation
generates code at run-time, the compiled products may always not know how
to call those run-time generated code and you need to markup your observed
properties with `@objc` attribute, which enforces the compiler to
generate codes to resolve the dispatch of the function at run-time.

Like Objective-C, there is no "general" aspect support in aspect-oriented
programming in Swift.

Well done. Apple made a good framework then we enjoy it and you still
cannot be managed to intervene the pan gesture recognizer of
`UIScrollView` -- is that the story's end?

Nope.

## Implementing General Aspect Supported Aspect-Oriented Programming

### A Naïve Approach

The simplest way to modify the behavior of a class instance in Objective-C
without subclassing is method swizzling. There are a lot of materials
talked about doing method swizzling in Objective-C or Swift, thus I don't
want to repeat it here again. I want to talk about the disadvantages of
this approach.

Firstly, method swizzling are done to classes. If we swizzled
`UIScrollView`, then all the instances of `UIScrollView` and its
descendants get the same behavior.

Then, even we are doing aspect-oriented programming, we don't mean to
abandon making **is-a** assertions, which is the key step to draw the
boundary of components' responsibilities and a corner stone of
whatever-oriented programming. Method swizzling is an anonymous approach
of modification which bypasses "making **is-a** assertions". This kind of
modification is likely to swing the foundation of software architecture
and hard to spot and trace.

Moreover, since Swift doesn't support overload `class func load()` method
of Objective-C bridged classes, many posts suggest you to put the method
swizzling code in `class func initialize()` instead. For there is only one
`class func initialize()` overload would be called for a class in a module
at app's launch time, then you have to put all the method swizzling code
of a class in one file -- or you would not know which
`class func initialize()` is called at launch time on earth, it might turn
out to be very tedious to manage the method swizzling code.

### A Sophisticated Approach

By giving a glimpse to the official supported aspect-oriented programming
framework -- Key-Value Observation, we can spot that it totally don't
have the disadvantages I talked above. How did Apple achieve this?

In fact, Apple implemented this aspect-oriented programming technique with
a technique called is-a swizzling.

Is-a swizzling is quite simple, even reflect on the code -- set an
object's is-a pointer to another class'.

```objectivec
Foo * foo = [[Foo alloc] init];
object_setClass(foo, [Bar class]);
```

And Key-Value Observation is just to create a subclass which inherited to
the observed object's class, then set the observed object's is-a pointer
to the is-a pointer of the newly created class. The whole progress can be
illustrated in following code:

```objectivec
@interface Foo: NSObject
// ...
@end

@interface NSKVONotifying_Foo: Foo
// ...
@end

NSKVONotifying_Foo * foo = [[NSKVONotifying_Foo alloc] init];
object_setClass(foo, [NSKVONotifying_Foo class]);
```

Since Apple have handed out a sophisticated solution about an "ad-hoc"
aspect-oriented programming, creating a subclass of the class of an object
and then setting its is-a pointer to the object's might work. But when
doing system design, the most important problem is: why may it work?

### An Analysis to KVO's design

Open Swift Playground and typing following code:

```swift version=4.2
import Cocoa

class Foo: NSObject {
    @objc var intValue: Int = 0
}

class Observer: NSObject { }

let foo = Foo()

let observer = Observer()

// We need to use `object_getClass` to check the real is-a pointer.

print(NSStringFromClass(object_getClass(foo)!))
print(NSStringFromClass(object_getClass(observer)!))

foo.addObserver(observer, forKeyPath: "intValue", options: .new, context: nil)

print(NSStringFromClass(object_getClass(foo)!))
print(NSStringFromClass(object_getClass(observer)!))
```

Then you can see the output:

```text
__lldb_expr_2.Foo
__lldb_expr_2.Observer
NSKVONotifying___lldb_expr_2.Foo
__lldb_expr_2.Observer
```

`__lldb_expr_2` is the module name generated by the Swift Playground and
added by the Swift compiler when bridging Swift class to Objective-C.
`NSKVONotifying_` is the guarding prefix added by KVO. `Foo` and
`Observer` is the class name we used in source code.

By such a glimpse to the internal of KVO, we can know that KVO creates
a new class for the observed object. But is it enough? I mean, is it
enough that one subclass for observed objects of one class?

Since KVO is a sophisticated framework, we can answer "yes" by intuition.
But if we do so, then we lost an opportunity to learn the reason why this
is enough.

In fact, since all the variants in observing an object's properties in KVO
are only in the observer's event handler:
`[NSObject -observeValueForKeyPath:ofObject:change:context:]`, on the
other hand, the observed object is just about to sending events -- which
is quite mechanical, the observed object side is dumbly fixed. This means
one subclass for observed objects of one class is totally enough --
because those observed objects of the same class actually work the same
way.

Replace the code in your Swift Playground with following code:

```swift version=4.2
import Cocoa

class Foo: NSObject {
    @objc var intValue: Int = 0
}

class Observer: NSObject { }

let foo = Foo()

let observer = Observer()

func dumpObjCClassMethods(class: AnyClass) {
    let className = NSStringFromClass(`class`)

    var methodCount: UInt32 = 0;
    let methods = class_copyMethodList(`class`, &methodCount);

    print("Found \(methodCount) methods on \(className)");

    for i in 0..<methodCount {
        let method = methods![numericCast(i)]

        let methodName = NSStringFromSelector(method_getName(method))
        let encoding = String(cString: method_getTypeEncoding(method)!)

        print("\t\(className) has method named '\(methodName)' of encoding '\(encoding)'")
    }

    free(methods)
}

foo.addObserver(observer, forKeyPath: "intValue", options: .new, context: nil)

dumpObjCClassMethods(class: object_getClass(foo)!)
```

Then you get the output:

```text
Found 4 methods on NSKVONotifying___lldb_expr_1.Foo
	NSKVONotifying___lldb_expr_1.Foo has method named 'setIntValue:' of encoding 'v24@0:8q16'
	NSKVONotifying___lldb_expr_1.Foo has method named 'class' of encoding '#16@0:8'
	NSKVONotifying___lldb_expr_1.Foo has method named 'dealloc' of encoding 'v16@0:8'
	NSKVONotifying___lldb_expr_1.Foo has method named '_isKVOA' of encoding 'c16@0:8'
```

By dumping the method of the class that created by KVO, we can notice that
there were several methods overloaded by it. The purpose of overloading
`setIntValue:` is quite straight -- we told the framework to observe the
`intValue` property, thus it overloaded the method to add notification
codes; `class` must be overloaded to return a fake is-a pointer which
points to the original class the object was; The purpose of overloading
`dealloc` probably is intended to release some garbage; The new method
`_isKVOA` is like a method returns boolean value by Cocoa's naming
convention. We can add following code in our Swift Playground:

```swift version=4.2
let isKVOA = foo.perform(NSSelectorFromString("_isKVOA"))!.toOpaque()

print("isKVOA: \(isKVOA)")
```

Then we get:

```text
isKVOA: 0x0000000000000001
```

Since the boolean true in Objective-C are practically stored as `1` in
memory, thus we can ensure that `_isKVOA` is just a method returns
boolean value. Obviously, we can infer that `_isKVOA` indicates whether
this class is a KVO generated class (Though we don't know what the
trailing `A` extactly means to be).

### Our System

Our system is not quit different from KVO.

First, our goal is to design a system offers "general" aspect support to
aspect-oriented programming, which means you can inject custom
implementation to any objects and any methods. This leads that creating
one class to umbrella all the changes done to the injected objects of one
class is no longer capable.

Second, we want a nominal approach instead of a non-nominal, or say
anonymous approach to make such an injection. Giving something a name
makes us to draw the boundary of responsibilities of the thing, and the
boundaries of responsibilities are the foundation of clean software
architecture.

Third, we want the system doesn't introduce any mechanisms that would
result to "scare" developers.

By referring to the design of KVO, we can hand out the following design:

- An object ( `Foo * foo` ) contains the methods to be injected into.

- A protocol ( `Aspect` ) to represent the aspect which defines the
  methods to be injected into (enforces the developer to give a name to
  the aspect).

- A class ( `Bar` ) nominally implements the aspect and offers
  implementations of the methods to be injected with.

- When an object was injected with custom implementations, the system
  creates a subclass ( `_ObjCGrafted_Foo_Aspect->Bar` ) which identifies
  each other by taking all the existed injections and incoming injections
  into consideration and sets the object's is-a pointer to the newly
  creates subclass'.

![Mechanism Explained](mechanism-explained.png 'Mechanism Explained')

> You may have spotted that the name of the system created class contains
> characters "->" which is illegal in source code. But in Objective-C
> runtime environment, these characters are permitted to be a part of
> the class name. These characters build up a guaranteed fence between
> system generated classes and those user created classes in source code.

The implementation is quite simple until you got touched with resolving
protocol hierarchy: which implementations should I take to inject with?

Considering following codes:

```objectivec
@protocol Foo<NSObject>
- (void)bar;
@end
```

Since `Foo` inherited to `NSObject` protocol, the declaration of method:
`-isKindOfClass:` is contained in the hierarchy. When we us this
protocol as an aspect, should we take the implementation of
`-isKindOfClass:` and inject it to the injected object?

Obviously not.

Since the aspect is the "proposal" of the injection, and the class
offers implementations to be injected with, I set a limitation here that
the system would only inject implementations which is implemented by the
leaf level of the class offers implementations. This means methods like
`-isKindOfClass:` would not be injected when you don't offer a custom
implementation in the class offers custom implementations, and you still
can inject methods like it when you implement your custom version in the
class offers custom implementations.

Finally, there is the [repository](https://github.com/WeZZard/ObjCGraft) and the API looks like below:

![API Explained](api-explained.png 'API Explained')

And there is the example code to intervene the pan gesture recognizer
of `UIScrollView`.

```objectivec path=MyUIScrollViewAspect.h
@protocol MyUIScrollViewAspect<NSObject>
- (BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer *)gestureRecognizer;
@end
```

```objectivec path=MyUIScrollView.h
#import <UIKit/UIKit.h>
@interface MyUIScrollView: UIScrollView<MyUIScrollViewAspect>
@end
```

```objectivec path=MyUIScrollView.m
#import "MyUIScrollView.h"

@implementation MyUIScrollView
- (BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer *)gestureRecognizer;
{
    // Do what you wanna do.
    return [super gestureRecognizerShouldBegin: gestureRecognizer];
}
@end
```

```objectivec path=MyViewController.m
// ...
UIScrollView * scrollView = [UIScrollView alloc] init];
object_graftImplemenationOfProtocolFromClass(scrollView, @protocol(MyUIScrollViewAspect), [MyUIScrollView class]);
// ...
```

## A Sequel to the Framework

I designed this framework in 2017. I didn't have much experience about
designing a framework which also contributes to easing the pain of
building software at that time. The thing I cared the most at that time
was drawing boundaries of responsibilities such that we can make a clean
software architecture. But the development of software is progressive.
This design may give an opportunity to a clean software architecture, but
enforcing developers to give an aspect a name at the very beginning time
slows down the progress of development.

> Name that can be named is not universal and eternal Name.
>
> -- Lao Tsu

We give something a name for somewhat purpose. If the purpose changes,
the name changes as follow. For example, the category of the parts of a
pig with a butcher's perspective is different from those of a biologist's.
In the progress of software development, the purpose comes from how we
define the questions and how we explain them, which varies as the
development of the whole software developing progress. Thus a good
framework which really contributes to easing the pain of building software
shall have a portion of API makes use anonymous functions, or say
closures in Swift and blocks in Objective-C. But since this framework was
designed in 2017 and I don't realize the things I mentioned above, it
doesn't support any anonymous functions.

I need more research to make this framework to support anonymous
functions. At least, at glance, the size of the reference of function in
Swift is 2 words which that of C is 1. Plus, compile-time resolving is
troublesome. Obviously this needs enormous amount of work and currently I
don't have so much time. But it would come true in the future.

---

[Repository](https://github.com/WeZZard/ObjCGraft) mentioned in this post.

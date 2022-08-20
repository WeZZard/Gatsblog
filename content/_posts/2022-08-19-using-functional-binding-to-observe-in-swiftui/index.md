---
title: Using Functional Binding to Observe in SwiftUI
category: Programming
tags: [SwiftUI, Binding, Swift, Observer]
---

## Story

This week, my colleague asked me a question: how to observe user selection
behaviors on SwiftUI's `Picker`?

This is a question came from real bussiness. Thus I think it worth to take
me time to solve it.

The example code is as shown below and my colleague wanted to observe user's
behaviors on selecting candidates of the `Picker`.

```swift
import SwiftUI

let labels = ["One", "Two", "Three", "Four"]

struct ContentView: View {
  
  var data = Array(labels.enumerated())
  
  @State
  var selection: Int = 0
  
  var body: some View {
    Picker("Picker", selection: $selection) {
      ForEach(data, id: \.offset) { (_, label) in
        Text(label)
      }
    }.pickerStyle(.inline)
  }
  
}
```

## Analysis

However, the meaning of "observe" varies over contexts:

- It can mean the time that user gets its finger down to the picker.
- It can mean the time that user gets its finger up from the picker.
- It can mean the time that the code changes the value of $selection.

Each of these leads to different solutions.

Since SwiftUI controls can adopt style modifiers which change the appearance
and behavior of a control, to achieve the goal that observing the first two
kinds of user behaviors that I mentioned above may need deep customizations
over the control itself.

But if you just want to observe the time that the code changes the value of
`$selection`, you must try functional `Binding`.

> "Wait! There is `onChange(of:, perform:)` modifier, why should I use what
> you called functional `Binding`?"

OK. We just have touched the key to my colleague's question: the timing of
`onChange(of:, perform:)` is difficult to predict and control.

In my colleague's code, he triggers network request and user behavior
observation with `onChange(of: perform)`. But the callback of network
request always comes about 30ms earlier than the callback of user behavior
observation. This phenomenon is caused by SwiftUI's evaluation order. You
can control the order by arranging the `onChange(of:, perform:)` modifiers
on SwiftUI's `View` hierarchy in a fine-grained order.

But we are engineering -- we cannot make the position to put modifiers to be
coupled with SwiftUI's `View` evalution order!

## Solution

To solve this problem, I suggest my colleague to wrap `$selection` with a
`Binding` by initializing with the following initializer:

```swift
public struct Binding<Value> {

  public init(
    get: @escaping () -> Value,
    set: @escaping (Value, Transaction) -> Void
  )

}
```

This is what I mentioned functional `Binding`.

Here is a use case of the initializer by combining the demo code I showned
at the beginning of the post:

```swift
struct ContentView: View {
  
  // ...

  var selectionBinding: Binding<Int> {
    Binding(
      get: {
        $selection.wrappedValue
      },
      set: { (newValue, tnx) in
        // call `.transaction` to make use of the incomming
        // `tnx : Transaction` object.
        $selection.transaction(tnx).wrappedValue = newValue
        observeSelectionChange()
      }
    )
  }

  func observeSelectionChange() {
    // do what you want to do
  }
 
  var body: some View {
    Picker("Picker", selection: selectionBinding) {
      ForEach(data, id: \.offset) { (_, label) in
        Text(label)
      }
    }.pickerStyle(.inline)
  }
  
}
```

In `observeSelectionChange` function you can organize your logics on user
behavior observation.

## Conclusion

Here is a couple of reasons why I recommend this way of user behavior
observation:

- SwiftUI is driven by value changes. This means that value changes are
ubiquitous in a running SwiftUI program to offer a lot of observation
points.

- `Binding` is more powerful than what you thought. It supports projection
with key-paths and collection subscripts which enables developers to
conducts partial value changes to a control or a `View`. This means that for
Apple shipped SwiftUI controls and well-designed third-party SwiftUI
controls you can observe all value changes conducted with these `Binding`s
by wrapping a functional `Binding`.

- `Binding` can observe all kinds of changes that can drive SwiftUI to
update `View` contents. In contrast, `onChange(of:, perform:)` requires
developers to observe over `Equatable` values. But there are types that are
not of `Equatable` but also able to drive SwiftUI to update `View` contents.
Here is one example: closures.

- In a functional `Binding` you can choose whether to observe before or
after the value change and control the order of actions that triggerred by
the value change.

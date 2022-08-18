---
title: Using Functional Binding to Observe in SwiftUI
category: Programming
tags: [SwiftUI, Binding, Swift]
---

## Story

This week, my colleague asked me a question: how to observe user selection
behavior on SwiftUI's `Picker`?

This is a question came from real bussiness. Thus I think it worth to take
me time to solve it.

The example code is as shown below and my colleague wanted to observe user's
behavior on selecting candidates of the `Picker`.

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

But the meaning of "observe" varies over contexts:

- It can mean the time that user gets its finger down to the picker.
- It can mean the time that user gets its finger up from the picker.
- It can mean the time that the code changes the value of $selection.

Each of these leads to different solutions.

Since SwiftUI controls adopt style modifiers which changes the appearance
and behavior of a control, to achieve the goal that observing the first two
kinds of user behaviors I mentioned above may need deep customizations over
the control itself.

But if you just want to observe the time that the code changes the value of
`$selection`, you must try functional `Binding`.

> "Wait! There is `onChange(of:, perform:)` modifier, why should I use what
> you called functional `Binding`?"

OK. We just have touched the key to my colleague's question: the timing of
`onChange(of:, perform:)` is difficult to predict and control.

In my colleague's code, he triggers the network request and user behavior
observation with `onChange(of: selection)`. But the network request is
always about 30ms earlier than the user behavior observation. This
phenomenon is caused by SwiftUI's `View.body` evaluation order. You can
control the order by arrange the `onChange(of:, perform:)` modifiers on 
SwiftUI's `View` hierarchy.

But we are engineering! We cannot make the position of modifiers coupled
with SwiftUI's `View` evalution order!

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

## Conclusion

Here is a couple of reasons why I recommend this way of user behavior
observation:

- SwiftUI is driven by value changes. This means that value changes are
ubiquitous in a running SwiftUI program which offers a lot of observation
points.

- `Binding` supports projection with key-path and collection subscripts
which enables developers to conducts partial value changes to a control or
a `View`. This means that you can always observe value changes with
functional `Binding` on SwiftUI controls shipped by Apple and well-designed
third-party SwiftUI controls.

- `Binding` can observe all kinds of changes that can drive SwiftUI to
update `View` contents. In contrast, `onChange(of:, perform:)` requires
developers to observe over `Equatable` values. But there are types that are
not of `Equatable` but can also drive SwiftUI to update `View` contents. For
example: closures.

- In a functional `Binding` you can choose whether to observe before or
after the value change and control the order of actions that triggerred by
the value change.

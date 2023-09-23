---
title: 在 SwiftUI 中使用函数式 Binding 实现观察者模式
category: 编程
tags: [SwiftUI, Binding, Swift, 观察者模式]
---

## 故事

这周，我的同事问了我一个问题：在 SwiftUI 中怎么观察用户对 `Picker` 的选择行为？

这是一个来自真实业务的问题，所以我觉得值得我花费时间去解决它。

范例代码如下所示，然后我的同事想观察用户对 `Picker` 候选项的选择行为。

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

## 分析

但是，「观察」本身的意义可能会随着上下文变动而变动：

- 它可以表示用户在 `Picker` 上放下手指的那一刻。
- 它可以表示用户在 `Picker` 上抬起手指的那一刻。
- 它可以表示 `Picker` 对 `$selection` 进行值变更的那一刻。

上述每一项都将导致不同的最终解决方案。

因为 SwiftUI 控件可以使用 style 修饰器，而 style 修饰器可以改变控件的样式和行为，想达成上述对用户行为的观察中的前两种需要对控件本身做深度定制。

但是如果你只是想观察 `Picker` 对 `$selection` 进行值变更的那个时刻，你一定要试试函数式 `Binding`。

> 等等！已经有 `onChange(of:, perform:)` 修饰器了，为什么我要用你说的函数式 `Binding`？

好的。我们已经触及了我同事问题的关键：`onChange(of:, perform:)` 的时机很难预测和控制。

在我同事的代码中，他使用 `onChange(of: perform)` 触发了网络请求和用户行为观察。但是网络请求的回调总是比用户行为观察回调要早 30ms。这个现象是因为 SwiftUI 的求值顺序造成的。你可以通过将 `onChange(of:, perform:)` 精心排列在视图树上来控制这个顺序。

但是我们在做工程——我们不能将修饰器的放置位置与 SwiftUI 的求值顺序耦合起来！

## 解决方案

为了解决这个问题，我建议我的同事将 `$selection` 通过下面这个 `Binding` 的 initializer 包装起来。

```swift
public struct Binding<Value> {

  public init(
    get: @escaping () -> Value,
    set: @escaping (Value, Transaction) -> Void
  )

}
```

这就是我所说的函数式 `Binding`。

以下是结合文章开头范例代码之后的这个 initializer 的用例：

```swift
struct ContentView: View {
  
  // ...

  var selectionBinding: Binding<Int> {
    Binding(
      get: {
        $selection.wrappedValue
      },
      set: { (newValue, tnx) in
        // 调用 `.transaction` 修饰器以利用 `tnx : Transaction` 对象.
        $selection.transaction(tnx).wrappedValue = newValue
        observeSelectionChange()
      }
    )
  }

  func observeSelectionChange() {
    // 做你想做的
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

在 `observeSelectionChange` 函数中你就可以组织你自己的用户行为观察逻辑了。

## 结论

这里有几个原因我建议你使用这种方式观察用户行为：

- SwiftUI 是值变更驱动的。这意味着值变更在一个运行中的 SwiftUI 程序中无处不在，并且为我们提供了很多观察点。

- `Binding` 比你想象的更强大。它支持针对 key-path 和 `Collection` 下标的 projection。这让开发者可以将局部的值变更传导到一个控件或者 `View` 上。这也意味着你可以通过嵌套函数式 `Binding` 来观察苹果一方控件以及良好设计的三方控件上的上述各种各样的 `Binding` 传导的变更。

- `Binding` 可以观察所有驱动 SwiftUI 进行视图更新的内容变更。相比之下，`onChange(of:, perform:)` 要求开发者观察 `Equatable` 的值。但是有许多不遵从 `Equatable` 的类型也可以驱动 SwiftUI 进行视图更新。这里有一个例子：闭包。

- 在一个函数式 `Binding` 中你可以选择在值变更之前或者之后观察，你也可以控制值变更带来的多个行为的顺序。

---
title: 在 SwiftUI 中使用函數式 Binding 實現觀察者模式
category: 編程
tags: [SwiftUI, Binding, Swift, 觀察者模式]
---

## 故事

這週，我的同事問了我一個問題：在 SwiftUI 中怎麼觀察用戶對 `Picker` 的選擇行爲？

這是一個來自真實業務的問題，所以我覺得值得我花費時間去解決它。

範例代碼如下所示，然後我的同事想觀察用戶對 `Picker` 候選項的選擇行爲。

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

但是，「觀察」本身的意義可能會隨着上下文變動而變動：

- 它可以表示用戶在 `Picker` 上放下手指的那一刻。
- 它可以表示用戶在 `Picker` 上擡起手指的那一刻。
- 它可以表示 `Picker` 對 `$selection` 進行值變更的那一刻。

上述每一項都將導致不同的最終解決方案。

因爲 SwiftUI 控件可以使用 style 修飾器，而 style 修飾器可以改變控件的樣式和行爲，想達成上述對用戶行爲的觀察中的前兩種需要對控件本身做深度定製。

但是如果你只是想觀察 `Picker` 對 `$selection` 進行值變更的那個時刻，你一定要試試函數式 `Binding`。

> 等等！已經有 `onChange(of:, perform:)` 修飾器了，爲什麼我要用你說的函數式 `Binding`？

好的。我們已經觸及了我同事問題的關鍵：`onChange(of:, perform:)` 的時機很難預測和控制。

在我同事的代碼中，他使用 `onChange(of: perform)` 觸發了網絡請求和用戶行爲觀察。但是網絡請求的回調總是比用戶行爲觀察回調要早 30ms。這個現象是因爲 SwiftUI 的求值順序造成的。你可以通過將 `onChange(of:, perform:)` 精心排列在視圖樹上來控制這個順序。

但是我們在做工程——我們不能將修飾器的放置位置與 SwiftUI 的求值順序耦合起來！

## 解決方案

爲了解決這個問題，我建議我的同事將 `$selection` 通過下面这个 `Binding` 的 initializer 包裝起來。

```swift
public struct Binding<Value> {

  public init(
    get: @escaping () -> Value,
    set: @escaping (Value, Transaction) -> Void
  )

}
```

這就是我所說的函數式 `Binding`。

以下是結合文章開頭範例代碼之後的這個 initializer 的用例：

```swift
struct ContentView: View {
  
  // ...

  var selectionBinding: Binding<Int> {
    Binding(
      get: {
        $selection.wrappedValue
      },
      set: { (newValue, tnx) in
        // 調用 `.transaction` 修飾器以利用 `tnx : Transaction` 對象.
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

在 `observeSelectionChange` 函數中你就可以組織你自己的用戶行爲觀察邏輯了。

## 結論

這裏有幾個原因我建議你使用這種方式觀察用戶行爲：

- SwiftUI 是值變更驅動的。這意味着值變更在一個運行中的 SwiftUI 程序中無處不在，並且爲我們提供了很多觀察點。

- `Binding` 比你想象的更強大。它支持針對 key-path 和 `Collection` 下標的 projection。這讓開發者可以將局部的值變更傳導到一個控件或者 `View` 上。這也意味着你可以通過嵌套函數式 `Binding` 來觀察蘋果一方控件以及良好設計的三方控件上的上述各種各樣的 `Binding` 傳導的變更。

- `Binding` 可以觀察所有驅動 SwiftUI 進行視圖更新的內容變更。相比之下，`onChange(of:, perform:)` 要求開發者觀察 `Equatable` 的值。但是有許多不遵從 `Equatable` 的類型也可以驅動 SwiftUI 進行視圖更新。這裏有一個例子：閉包。

- 在一個函數式 `Binding` 中你可以選擇在值變更之前或者之後觀察，你也可以控制值變更帶來的多個行爲的順序。

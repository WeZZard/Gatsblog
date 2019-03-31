---
title: 淺談 Swift 泛型元編程
subtitle: 建構一個在編譯時就確保了安全的 VFL 助手庫
isPublished: false
---

## 前言

什麼是在你選擇一門編程語言的時候最能左右你決定的事？

有人會說，寫得越少，語言越好。（並不是，PHP 是最好的語言。）

好吧，這也許是真的。但是寫得少並不是一個可以在何時何地都得到同一結果的可以量化的指標。根據你任務的不同，代碼的行數也在上下浮動。

我認爲最好的方法是考察編程語言有多少 primitives（元語）。

對於一些老式的編程語言而言，他們有的沒有多維數組。這意味着數組並不能包含他們自己。這束縛了一些開發者來發明某些具有遞歸性質的數據結構，同時也限制了語言的表達性。語言的表達性，形式化地講，就是**語言的計算能力**。

但是我剛剛提到的這個數組的例子僅僅只和運行時計算能力有關。編譯時計算能力又是怎樣呢？

好的。像 C++ 這樣具備顯示編譯過程以及一些「代碼模板」設施的語言是具有進行某些編譯時計算的能力。他們通常是收集源代碼的碎片，然後將他們組織成一段新的代碼。你也許已經聽過一個大詞了：「元編程」。是的，這就是元編程（但是是在編譯時）。而這些語言也包含了 C 和 Swift。

C++ 元編程依賴於模板。在 C 中，元編程依賴於一個來自 **libobjcext** 的特殊頭文件 `metamacros.h`。在 Swift 中，元編程依賴於泛型。

儘管你可以在這三種語言中做編譯時元編程，其能力又是不同的。因爲已經有很多文章談論 C++ 模板爲什麼是**圖靈完備**（一種計算能力的度量，你可以簡單認爲它就是「啥都能算」）的了，我不想在這上面浪費我的實踐。我要討論的是 Swift 中的泛型元編程，以及要給 C 中的 `metamacros.h` 作一個簡單的介紹。這兩種語言的編譯時元編程能力都比 C++ 要弱。他們僅僅只能夠實現一個 **DFA**（確定性自動機，另一種計算能力的度量。你可以簡單的認爲它就是「能計算有限的模式」）上限的編譯時計算設施。

---

## 案例研究: 在編譯時就確保了安全的 VFL

我們有許多 Auto Layout 助手庫：Cartography, Mansory, SnapKit... 但是，他們真的好嗎？要是有一個 Swift 版本的 VFL 能在編譯時就確保正確性而且能夠和 Xcode 的代碼補全聯動如何？

老實說，我是一個 VFL 愛好者。你可以用一行代碼就對很多視圖進行佈局。要是是 Cartography 或者 SnapKit，早就「王婆婆的裹腳又長又臭」了。

由於原版的 VFL 對於現代 iOS 設計的支持上有一點問題，這主要表現在不能和 layout guide 合作上，你也許也想要我們馬上要實現的這套 API 能夠支持 layout guide。

最後，在我的生產代碼中，我構建了如下的可以在編譯時就確保了安全的並且支持 layout guide 的 API。

```swift
// 創建佈局約束並且裝置入視圖

constrain {
    withVFL(H: view1 - view2)
    
    withVFL(H: view.safeAreaLayoutGuide - view2)
    
    withVFL(H: |-view2)
}

// 僅僅創建佈局約束

let constraints1 = withVFL(V: view1 - view2)

let constraints2 = withVFL(V: view3 - view4, options: .alignAllCenterY)
```

想想一下在 Cartography 或者 SnapKit 中構建等效的事情需要多少行代碼？想知道我怎麼構建出來的了嗎？

讓我來告訴你。

### 語法變形

如果我們將原版的 VFL 語法導入到 Swift 源代碼中並且去處掉字符串字面量的引號，你很快就會發現一些在原版 VFL 中所使用的字符像 `[`, `]`, `@`, `(` 和 `)` 是不能在 Swift 中用作操作符重載的。於是我對原版 VFL 語法做了一些變形：

```swift
// 原版 VFL: @"|-[view1]-[view2]"
withVFL(H: |-view1 - view2)

// 原版 VFL: @"[view1(200@20)]"
withVFL(H: view1.where(200 ~ 20))

// 原版 VFL: @"V:[view1][view2]"
withVFL(V: view1 | view2)

// 原版 VFL: @"V:|[view1]-[view2]|"
withVFL(V: |view1 - view2|)

// 原版 VFL: @"V:|[view1]-(>=4@200)-[view2]|"
withVFL(V: |view1 - (>=4 ~ 200) - view2|)
```

### 探索實現

如何達成我們的設計？

一個來自直覺的答案就是使用操作符重載。

是的。我已經在我的生產代碼中用操作符重載達成了我們的設計。但是操作符重載在這裏是如何工作的？我是說，爲什麼操作符重載可以承載我們的設計？

在回答這個問題之前，讓我們看一些例子。

```swift
withVFL(H: |-view1 - view2 - 4)
```

上例是一個是一個不應該被編譯器接受的非法輸入。相應的原版 VFL 如下：

```objectivec
@"|-[view1]-[view2]-4"
```

我們可以發現在 `4` 之後缺少了一個視圖，或者一個 `|` 又或者一個 `-|`。

我們希望我們的系統可以通過讓編譯器接受一段輸入來把控正確的輸入，通過讓編譯器拒絕一段輸入來把控錯誤的輸入（因爲這就是**編譯時就確保了安全的**所隱含的意思）。這背後的祕密並不是由一個擡頭是「高級軟件開發工程師」的神祕工程師施放的黑魔法，而是簡單的通過匹配用戶輸入與已經定義好了的函數來接受用戶輸入，通過失配用戶輸入和已經定義好了的函數來拒絕用戶輸入。

比如，就像上例中 `view1 - view2` 拿部分所示，我們可以設計如下函數來把控他。

```swift
func - (lhs: UIView, rhs: UIView) -> BinarySyntax {
    // Do something really combine these two views together.
}
```

如果我們將上述代碼塊中的 `UIView` 和 `BinarySyntax` 看作兩個狀態，那麼我們就可以在我們的系統中引入狀態轉移了，而狀態轉移的方法就是操作符重載。

### 樸素的狀態轉移

知道了通過操作符重載引入狀態轉移也許能解決我們的問題，我們可以呼一口氣了。

但是……這個解決方案下我們要創建多少種狀態？

你也許不知道的是，VFL 可以被表達爲一個 DFA。

是的。因爲如`[`, `]`, `(` 和 `)` 這樣的遞歸文本在 VFL 中並不是真正的遞歸文本（在正確的 VFL 中他們只能出現一層並且無法嵌套），一個 DFA 就可以表述出 VFL 的所有可能的輸入集合。

於是我繪製了一個 DFA 來模擬我們設計中的狀態轉移。要小心。在這種圖中我沒有把 layout guide 放進去。加入 layout guide 只會讓這個 DFA 變得更複雜。

> 瞭解更多的關於遞歸和 DFA 的樸實的簡介你可以看看這本書[計算的本質：深入剖析程序和計算機](https://www.amazon.cn/dp/B0153173HI/ref=sr_1_1)

![CTVFL Automaton](ctvfl-automaton.svg "CTVFL Automaton")

> 上圖中, `|pre` 表示一個前綴 `|` 操作符，同樣的，`|post` 表示一個後綴 `|` 操作符。兩個圓圈表示接受，單個圓圈表示接收。

數我們要創建的類型的數目是一個複雜的任務。由於有雙目操作符 `|` 和 `-`，還有單目操作符 `|-`, `-|`, `|prefix` 和 `|postfix`，計數方法在這兩種操作符中是不同的。

一個雙目操作符消耗兩次狀態轉移，但是一個單目操作符消耗一次。每一個操作符都將創建一個新的類型。

因爲這個計數方法本身實在太複雜了，我寧願想想別的方法……

### 多狀態的狀態轉移

我是通過死命測試可能的輸入字符以測試一個狀態是否接受他們來畫出上面這個 DFA 圖的。這將所有的一切都映射到了一個一個維度上。也許我們可以通過在多個維度對問題進行抽象來創造一種更加清澈的表達。

> 在開始深入探索前，我們不得不獲取一些關於 Swift 操作符結合性的一些基礎知識。
>
> 結合性是一個操作符（嚴格來講，雙目操作符。就是像 `-` 那樣連結左手邊算子和右手邊算子的操作符）在編譯時期，確定編譯器選擇在哪邊構建語法樹的一個性質。Swift 默認的操作符結合性是向左。這意味着編譯器更加傾向於在一個操作符的左手邊構建語法樹。於是我們可以知道，對於一個由向左結合的操作符生成的語法樹，其在視覺上是向左傾斜的。

首先讓我們來看看幾個最簡單的表達式：

```swift
// 應該接受
withVFL(H: view1 - view2)

// 應該接受
withVFL(H: view1 | view2)

// 應該接受
withVFL(H: |view1|)

// 應該接受
withVFL(H: |-view1-|)
```

他們的語法樹如下：

![簡單表達式](simple-syntaxes.png "簡單表達式的語法樹")

然後我們可以將情況分爲兩類：

- 像 `view1 - view2`, `view1 | view2` 這樣的雙目表達式。

- 像 `|view1`, `view1-|` 這樣的單目表達式。

這使我們直覺地創建了兩種類型：

```swift
struct Binary<Lhs, Rhs> { ... }

func - <Lhs, Rhs>(lhs: Lhs, rhs: Rhs) -> Binary { ... }

func | <Lhs, Rhs>(lhs: Lhs, rhs: Rhs) -> Binary { ... }

struct Unary<Operand> { ... }

prefix func | <Operand>(operand: Operand) -> Unary { ... }

postfix func | <Operand>(operand: Operand) -> Unary { ... }

prefix func |- <Operand>(operand: Operand) -> Unary { ... }

postfix func -| <Operand>(operand: Operand) -> Unary { ... }
```

但是這夠了嗎？

#### Syntax Attribute

你馬上會發現，我們可以將任何東西代入 `Binary` 的 `Lhs` 或者 `Rhs`，或者 `Unary` 的 `Operand` 中。我們需要做一些限制。

典型而言，像 `|-`, `-|`, `|prefix`, `|postfix` 這種輸入只應該出現在表達式首尾兩端。因爲我們也希望支持 layout guide（如 `safeAreaLayoutGuide`），而 layout guide 也只應該出現在表達式首尾兩端，我們還需要對這些東西做一些限制來確保他們僅僅出現在表達式的兩端。

```swift
|-view-|
|view|
```

另外，像 `4`, `>=40` 這種輸入只應該和前驅和後繼視圖/父視圖或者 layout guide 配合出現。

```swift
view - 4 - safeAreaLayoutGuide

view1 - (>=40) - view2
```

以上對於表達式的研究提示我們要將所有參與表達式的事情分成三組：**layout'ed object** (視圖), **confinement** (layout guides 以及被 `|-`, `-|`, `|prefix` 還有 `|postfix` 包裹起來的東西), 和 **constant**.

現在我們要將我們的設計變更爲：

```swift
protocol Operand {
    associatedtype HeadAttribute: SyntaxAttribute
    
    associatedtype TailAttribute: SyntaxAttribute
}

protocol SyntaxAttribute {}

struct SyntaxAttributeLayoutedObject: SyntaxAttribute {}

struct SyntaxAttributeConfinment: SyntaxAttribute {}

struct SyntaxAttributeConstant: SyntaxAttribute {}
```

然後對於像 `view1 - 4 - view2` 之類的組合，我們可以創建下列表達式類型：

```swift
/// 連結 `view - 4`
struct LayoutableToConstantSpacedSyntax<Lhs: Operand, Rhs: Operand>: 
    Operand where
    /// 確認左手邊算子的尾部是不是一個 layouted object
    Lhs.TailAttribute == SyntaxAttributeLayoutedObject,
    /// 確認右手邊算子的頭部是不是一個 constant
    Rhs.HeadAttribute == SyntaxAttributeConstant
{
     typealias HeadAttribute = Lhs.HeadAttribute
     typealias TailAttribute = Lhs.TailAttribute
}

func - <Lhs, Rhs>(lhs: Lhs, rhs: Rhs) -> LayoutableToConstantSpacedSyntax<Lhs, Rhs> { ... }

/// 連結 `(view - 4) - view2`
struct ConstantToLayoutableSpacedSyntax<Lhs: Operand, Rhs: Operand>:
    Operand where
    /// 確認左手邊算子的尾部是不是一個 constant
    Lhs.TailAttribute == SyntaxAttributeConstant,
    /// 確認右手邊算子的頭部是不是一個 layouted object
    Rhs.HeadAttribute == SyntaxAttributeLayoutedObject
{
     typealias HeadAttribute = Lhs.HeadAttribute
     typealias TailAttribute = Lhs.TailAttribute
}

func - <Lhs, Rhs>(lhs: Lhs, rhs: Rhs) -> ConstantToLayoutableSpacedSyntax<Lhs, Rhs> { ... }
```

通過遵從 `Operand` 協議，一個類型實際上就獲得了兩個編譯時容器，它們的名字分別爲：`HeadAttribute` 和 `TailAttribute`；其值則是屬於 `SyntaxAttribute` 的類型。通過調用函數 `-` (上述代碼塊的任意一個)，編譯器將檢查左手邊算子和右手邊算子是否和函數返回值（`ConstantToLayoutableSpacedSyntax` 或
`LayoutableToConstantSpacedSyntax`）中的泛型約束一致。如果成功了，我們就可以說狀態成功地被轉移到另外一個了。

我們可以看到，因爲我們在上述類型的體內已經設置了 `HeadAttribute = Lhs.HeadAttribute` 和 `TailAttribute = Lhs.TailAttribute`，現在 `Lhs` 和 `Rhs` 的頭部和尾部的 attribute 已經從 `Lhs` 和 `Rhs` 上被轉移到了這個被新合成的類型上。而值就被儲存在其 `HeadAttribute` 和 `TailAttribute` 上。

然後我們成功讓編譯器接受了類似 `view1 - 4 - view2`, `view1 - 10 - view2 - 19` 這樣的輸入……等等！`view1 - 10 - view2 - 19`??? `view1 - 10 - view2 - 19` 應該是一個被編譯器拒絕的非法輸入！

#### Syntax Boundaries

實際上，我們剛才僅僅只是保證了一個視圖緊接着一個數字、一個數字緊接着一個視圖，而這和表達式是否以一個視圖（或者 layout guide）開始或結束無關。

爲了使表達式始終以一個視圖，layout guide 或者 `|-`, `-|`, `|prefix` 和 `|postfix` 開頭，我們必須要構建一個幫助我們**過濾**掉無效輸入的邏輯——就像我們之前做的 `HeadAttribute = Lhs.HeadAttribute` 和 `TailAttribute = Lhs.TailAttribute` 那樣。我們可以發現實際上我們剛才提到的表達式中有兩組：**confinement** 和 **layout'ed object**。爲了使表達式始終以這兩組表達式中的表達式開頭或者結尾，我們必須使用編譯時`或`邏輯來實現它。我們用運行時代碼寫出來就是：

```swift
if (lhs.tailAttribute == .isLayoutedObject || lhs.tailAttribute  == .isConfinment) &&
    (rhs.headAttribute == .isLayoutedObject || rhs.headAttribute == .isConfinment)
{ ... }
```

但是這個邏輯不能在 Swift 編譯時中被簡單實現，而且 Swift 編譯時計算的唯一邏輯就是`與`邏輯。由於在 Swift 中我們只能在類型約束中使用`與`邏輯（通過使用 `Lhs.TailAttribute == SyntaxAttributeLayoutedObject`
和 `Rhs.HeadAttribute == SyntaxAttributeConstant` 中的 `,` 符號），我們只能將上述代碼塊中的 `(lhs.tailAttribute == .isLayoutedObject || lhs.tailAttribute  == .isConfinment)` 和 `(rhs.headAttribute == .isLayoutedObject || rhs.headAttribute == .isConfinment)` 融合起來存入一個編譯時容器的值，然後使用`與`邏輯來連結他們。

> 實際上，`Lhs.TailAttribute == SyntaxAttributeLayoutedObject` 或者 `Rhs.HeadAttribute == SyntaxAttributeConstant` 中的 `==` 和大多數編程語言中的 `==` 操作符等效。另外，Swift 編譯時計算中也有一個和 `>=` 等效的操作符： `:`
>
> 考慮下列代碼：
>
> ```swift
> protocol One {}
> protocol Two: One {}
> protocol Three: Two {}
>
> struct Foo<T> where T: Two {}
> ```
>
> 現在 `Foo` 中的 `T` 只能是「比 `Two` 大」的了.  
>

然後我們可以將我們的設計變更爲：

```swift
protocol Operand {
    associatedtype HeadAttribute: SyntaxAttribute

    associatedtype TailAttribute: SyntaxAttribute

    associatedtype HeadBoundary: SyntaxBoundary

    associatedtype TailBoundary: SyntaxBoundary
}

protocol SyntaxBoundary {}

struct SyntaxBoundaryIsLayoutedObjectOrConfinment: SyntaxBoundary {}

struct SyntaxBoundaryIsConstant: SyntaxBoundary {}
```

這一次我們加入了兩個編譯時容器：`HeadBoundary` 和 `TailBoundary`，其值是屬於 `SyntaxBoundary` 的類型。對於視圖或者 layout guide 對象而言，他們提供了首尾兩個 `SyntaxBoundaryIsLayoutedObjectOrConfinment` 類型的 boundaries。當調用 `-` 函數時，視圖或者 layout guide 的 boundary 信息就會被傳入新合成的類型中。

```swift
/// 連結 `view - 4`
struct LayoutableToConstantSpacedSyntax<Lhs: Operand, Rhs: Operand>: 
    Operand where 
    /// 確認 Lhs 的 TailAttribute 是 SyntaxAttributeLayoutedObject
    Lhs.TailAttribute == SyntaxAttributeLayoutedObject,
    /// 確認 Rhs 的 HeadAttribute 是 SyntaxAttributeConstant
    Rhs.HeadAttribute == SyntaxAttributeConstant
{
    typealias HeadBoundary = Lhs.HeadBoundary
    typealias TailBoundary = Rhs.TailBoundary
    typealias HeadAttribute = Lhs.HeadAttribute
    typealias TailAttribute = Lhs.TailAttribute
}

func - <Lhs, Rhs>(lhs: Lhs, rhs: Rhs) -> LayoutableToConstantSpacedSyntax<Lhs, Rhs> { ... }
```

現在我們可以修改我們的 `withVFL` 系列函數的函數簽名爲：

```swift
func withVFL<O: Operand>(V: O) -> [NSLayoutConstraint] where
    O.HeadBoundary == SyntaxBoundaryIsLayoutedObjectOrConfinment,
    O.TailBoundary == SyntaxBoundaryIsLayoutedObjectOrConfinment
{ ... }
```

然後，只有 boundaries 是視圖或者 layout guide 的表達式才能被接受了。

#### Syntax Associativity

但是 syntax boundaries 的概念還是不能幫助編譯器停止接受如 `view1-| | view2` 或者 `view2-| - view2` 之類的輸入。這是因爲即使一個表達式的 **boundaries** 被確保了，你還是不能保證這個表達式是否是 **associable** （可結合）的。

於是我們要在我們的設計中引入第三對 `associatedtype`：

```swift
protocol Operand {
    associatedtype HeadAttribute: SyntaxAttribute
    
    associatedtype TailAttribute: SyntaxAttribute
    
    associatedtype HeadBoundary: SyntaxBoundary
    
    associatedtype TailBoundary: SyntaxBoundary
    
    associatedtype HeadAssociativity: SyntaxAssociativity
    
    associatedtype TailAssociativity: SyntaxAssociativity
}

protocol SyntaxAssociativity {}

struct SyntaxAssociativityIsOpen: SyntaxAssociativity {}

struct SyntaxAssociativityIsClosed: SyntaxAssociativity {}

```

對於像 `|-`, `-|` 之類的表達式或者一個表達式中的 layout guide，我們就可以在新類型的合成過程中關掉他們的 associativity。

這足夠了嗎？

是的。實際上，我在這裏做了個弊。你也許會驚訝，爲什麼我可以通過舉例快速地發現問題，一起可以對上面這個問題沒有猶豫地說「是」。原因是，我已經在紙上枚舉完了所有語法樹的構型。在紙上計畫是成爲一個優秀軟件工程師的好習慣。

現在語法樹設計的核心概念已經非常接近我的生產代碼了。你可以在[這裏](https://github.com/WeZZard/CTVFL/tree/master/CTVFL/Syntaxes)查看他們。

### 生成 NSLayoutConstraint 實例

好了，回來。我們還有東西要來實現。這對我們整體的工作很重要——生成佈局約束。

由於我們在 `withVFL(V:)` 系列函數的參數中所獲的的是一個語法樹，我們可以簡單地構建一個環境來對這個語法樹進行求值。

> 我正在剋制自己使用大詞，所以我說的是「構建一個環境」。但是禁不住告訴你，我們現在要開始構建一個虛擬機了！

![一些語法樹的例子](simple-syntaxes.png "一些語法樹的例子")

通過觀察一顆語法樹，我們可以發現每一層語法樹都是或不是一個單目操作符節點、雙目操作符節點或者算子節點。我們可以將 `NSLayoutConstraint` 的計算抽象成**小碎片**，然後讓這三種節點產生這些**小碎片**。

聽起來很好。但是怎樣做這個抽象呢？如何設計那些**小碎片**呢？

> 對於有虛擬機設計經驗或者編譯器構造經驗的人來說，他們也許會知道這是一個有關「過程抽象」和「指令集設計」的問題。但是我並不想嚇唬到像你這樣可能對這方面沒有足夠知識的讀者，於是我之前稱呼他們爲「將 `NSLayoutConstraint` 的計算抽象成」「小碎片」。
>
> 另一個讓我不以「過程抽象」和「指令集設計」來談論這個問題的理由是「指令集設計」是整個解決方案的最前端：你之後將會得到一個被稱作 opcode （operation code 的縮寫，我也不知道爲什麼他們這樣縮略這個術語）的東西。但是「指令集設計」會嚴重影響「過程抽象」的最終形態，而如果在做「指令集設計」之前跳過思考「過程抽象」的問題的話，你也很難揣測出指令集背後的概念。

#### 抽象 NSLayoutConstraint 的初始化過程

猶豫我們要支持 layout guide，那麼老式的 API：

```swift
convenience init(
    item view1: Any, 
    attribute attr1: NSLayoutConstraint.Attribute, 
    relatedBy relation: NSLayoutConstraint.Relation, 
    toItem view2: Any?, 
    attribute attr2: NSLayoutConstraint.Attribute, 
    multiplier: CGFloat, 
    constant c: CGFloat
)
```

就變得不可用了。你不能用這個 API 讓 layout guide 工作。是的，我試過。

然後我們也許會想起 layout anchors。

是的，這是可行的。我的生產代碼就是利用的 layout anchors。但是爲什麼 layout anchors 可行？

實際上，我們可以通過檢查文檔來知道 layout anchors 的基類 `NSLayoutAnchor` 有一組生成 `NSLayoutConstraint` 的 API。如果我們可以在確定的步驟內獲得這組 API 的所有參數，那麼我們就可以爲這個計算過程抽象出一個形式化的模型。

我們可以在確定的步驟內獲得這組 API 的所有參數嗎？

答案顯然是「是的」。

#### 語法樹求值一瞥

在 Swift 中，語法樹的求值是深度優先遍歷的。下面這張圖就是下面這個代碼塊中 `view1 - bunchOfViews` 的求值順序。

```swift
let bunchOfViews = view2 - view3
view1 | bunchOfViews
```

![Swift 語法樹求值](syntax-tree-evaluation.png "Swift 語法樹求值")

但是雖然根節點是整個求值過程中最先被訪問的，猶豫它需要它左手邊子節點和右手邊子節點的求值過程來完成求值過程，它將最後一個生成 `NSLayoutConstraint` 實例。

#### 抽象 NSLayoutConstraint 的計算過程

通過觀察上面這個 Swift 語法樹求值過程的插圖，我們可以知道節點 `view1` 將於第二位被求值，但是求值結果最後才用得上。所以我們需要一個數據結構可以保存每一個節點的求值結果。你也許想起來了要用棧。是的。我在我的生產代碼中就是用的棧。但是你應該知道爲什麼我們要用棧：一個棧可以將遞歸結構轉換爲線性的，這就是我們想要的。你也許已經猜到了我要用棧，但是直覺並不是每次都靈。

有了這個棧，我們就可以將所有初始化一個 `NSLayoutConstraint` 實例的計算資源放入之中了。

另外，我們也要讓棧能夠記憶已經被求完值的語法樹的首尾節點。

爲什麼？看看下面這個語法樹。
Why? Take a look at the following syntax tree:

![一個複雜的語法樹](complicated-syntax-tree.png "一個複雜的語法樹")

這個語法樹由以下表達式生成。

```swift
let view2_3 = view2 - view3
let view2_4 = view2_3 - view4
view1 | view2_4
```

當我們對位於樹的第二層（從根節點開始數）的 `-` 節點進行求值時，我們必須要選取 `view3` 這個「內側」來創建一個 `NSLayoutConstraint` 實例。實際上，生成 `NSLayoutConstraint` 實例總是需要選取從被求值節點看起來是「內側」的節點。但是對於跟節點 `|` 來說，「內側」節點就變成了 `view1` 和 `view2`。所以我們不得不讓棧來記憶被已經求完值的語法樹的首尾節點。

#### 關於 "返回值"

是的，我們不得不設計一個機制來讓語法樹的每一個節點來返回求值結果。

我並不想談論真實電腦是如何在棧幀間是如何傳遞返回值的，因爲這會根據返回數據的大小不同而不同。在 Swift 世界中，由於所有東西都是安全的，這意味着能夠綁定一片內存爲其他類型的 API 是非常難用的，以碎片化的節奏來處理數據也不是一個好選擇（至少不是編碼效率的）。

我們只需要使用一個在求值上下文中的本地變量來保存棧的最後一個彈棧結果，然後生成從這個變量取回數據的指令，然後我們就完成了「返回值」系統的設計。

#### 構建虛擬機

一旦我們完成了過程抽象，指令集的設計就只差臨門一腳了。

實際上，我們就是需要讓指令做如下事情：

- 取回視圖、layout guide、約束關係、約束常數、約束優先級。

- 生成要選取那個 layout anchor 的信息。

- 創建佈局約束。

- 壓棧、彈棧。

完成的生產代碼[在這裏](https://github.com/WeZZard/CTVFL/blob/master/CTVFL/VM/CTVFLOpcode.swift)

### 評估。

我們已經完成了我們這個編譯時確保安全的 VFL 的概念設計。

問題是我們得到了什麼？

#### 對於我們的編譯時確保安全的 VFL

我們在此獲得的優勢是表達式的正確性是被保證了的。諸如 `withVFL(H: 4 - view)` 或者 `withVFL(H: view - |- 4 - view)` 之類的表達式將被在編譯時就被拒絕。

然後，我們已經讓 layout guide 和我們的 VFL Swift 實現一起工作了起來。

第三，由於我們是在執行由編譯時組織的語法樹生成的指令，總體的計算複雜度就是 `O(N)`，這個 `N` 是語法樹生成的指令的數目。但是因爲語法樹並不是編譯時完成構建，我們必須要在運行時完成語法樹的構建。好消息是，在我的生產代碼中，語法樹的類型都是 `struct`，這意味着語法樹的構建都是在棧內存上而不是堆內存。

事實上，在一整天的優化後，我的生產代碼超越了所有已有的替代方案（包括 Cartography 和 SnapKit）。這當然也包含了原版的 VFL。我將會在本文後部分放置一些優化技巧。

#### 對於 VFL

理論上，相對於我們的設計，原版 VFL 在性能上存在一些優勢。VFL 字符串實際上在可執行文件（Mach-O 文件）的 data 段中被儲存爲了 C 字符串。操作系統直接將他們載入內存且在開始使用前不會有任何初始化動作。載入這些 VFL 字符串後，目標平臺的 UI 框架就預備對 VFL 字符串進行解析了。由於 VFL 語法十分簡單，構建一個時間複雜度是 `O(N)` 的解析器也很簡單。但是我不知道爲什麼 VFL 是所有幫助開發者構建 Auto Layout 佈局約束方案中最慢的。

#### 性能測試

以下結果通過在 iPhone X 上衡量 10k 次佈局約束構建測得。

![Benchmark 1](benchmark-1-view.png "Benchmark with 1 View")
![Benchmark 2](benchmark-2-views.png "Benchmark with 2 Views")
![Benchmark 3](benchmark-3-views.png "Benchmark with 3 Views")

---

## 深入閱讀

### Swift 優化

#### Array 的代價

Swift 中的 `Array` 會花費很多時間在判斷它的內部容器是 Objective-C 還是 Swift 實現的這點上。使用 `ContiguousArray` 可以讓你的代碼單單以 Swift 的方式思考。

#### Collection.map 的代價

Swift 中的 `Collection.map` 被優化得很好——它每次在添加元素前都會進行預分配，這消除了頻繁的分配開銷。

![Collection.map 的代價](map-cost.png "Collection.map 的代價")

但是如果你將數組 `map` 成多維數組，然後將他們 `flatten` 成低維數組的話，在一開始新建一個 `Array` 然後預分配好所有空間，再調用傳統的 `Array` 的 `append(_:)` 函數會是一個更好的選擇。

#### 不具名類型的代價

不要在寫入場合使用不具名類型（tuples）。

![Non-Nominal Types 的代價](non-nominal-type-cost.png "Non-Nominal Types 的代價")

當寫入不具名類型時，Swift 需要訪問運行時來確保代碼安全。這將花費很多時間，你應該使用一個具名的類型，或者說 `struct` 來代替它。

#### subscript.modify 函數的代價

在 Swift 中，一個 `subscript`(`self[key]` 中的 `[key]`) 有三種潛在的配對函數。

- `getter`

- `setter`

- `modify`

什麼是 `modify`?

考慮以下代碼：

```swift
struct StackLevel {
    var value: Int = 0
}

let stack: Array<StackLevel> = [.init()]

// 使用 subscript.setter
stack[0] = StackLevel(value: 13)

// 使用 subscript.modify
stack[0].value = 13
```

`subscript.modify` 是一種用來修改容器內部元素的某一個成員值的函數。但是它看起來做的比單純修改值要多。

![subscript.modify 的代價](subscript-modify-cost.png "subscript.modify 的代價")

我甚至無法理解我的求值樹中的 `malloc` 和 `free` 是怎麼來的。

我將求值棧從 `Array` 替換爲了自己的實現，並且實現了一個叫 `modifyTopLevel(with:)` 來修改棧的頂部。

```swift
internal class _CTVFLEvaluationStack {
    internal var _buffer: UnsafeMutablePointer<_CTVFLEvaluationStackLevel>

    ...

    internal func modifyTopLevel(with closure: (inout _CTVFLEvaluationStackLevel) -> Void) {
        closure(&_buffer[_count - 1])
    }
}
```


#### OptionSet 的代價

Swift 中 `OptionSet` 帶來的方便不是免費的.

![OptionSet 的代價](option-set-cost.png "OptionSet 的代價")

你可以看到 `OptionSet` 使用了一個非常深的求值樹來獲得一個可以被手動 bit masking 求得的值。我不知道這個現象是不是存在於 release build 中，但是我現在在生產代碼中使用的是手動 bit masking。

#### Exclusivity Enforcement 的代價

Exclusivity enforcement 也對性能有衝擊。在你的求值棧中你可以看見很多 `swift_beginAcces` 和 `swift_endAccess` 的調用。如果你對自己的代碼有自信，我建議關掉運行時 exclusivity enforcement。在 Build Settings 中搜索 “exclusivity” 可以看到相關選項。

> 在 Swift 5 下的 release build 中，exclusivity enforcement 是默認開啓的.

![Exclusivity Enforcement 的代價](exclusivity-enforcement-cost.png "Exclusivity Enforcement 的代價")

### C 的編譯時計算

我還在我的一個[框架中](https://github.com/WeZZard/ObjCDeepDynamic/wiki/Enrich-Auto-Synthesizable-%40dynamic-Property-Types)實現一種有趣的語法：
通過 `metamacros.h` 來爲 `@dynamic` property 來添加自動合成器。範例如下：

```objectivec
@ObjCDynamicPropertyGetter(id, WEAK) {
    // _cmd 變成了 _prop
    // 其餘和一個 atomic weak Objective-C getter 一樣.
}

@ObjCDynamicPropertyGetter(id, COPY) {
    // _cmd 變成了 _prop
    // 其餘和一個  atomic copy Objective-C getter 一樣.
}

@ObjCDynamicPropertyGetter(id, RETAIN, NONATOMIC) {
    // _cmd 變成了 _prop
    // 其餘和一個  nonatomic retain Objective-C getter 一樣.
};
```

實現文件在[這](https://github.com/WeZZard/ObjCDeepDynamic/blob/master/ObjCDeepDynamic/DynamicProperty/ObjCDynamicPropertySynthesizer.h).

對於 C 程序員而言，`metamacros.h` 是一個非常有用的用來創建宏來減輕難負擔的腳手架。

---

謝謝你閱讀完了這麼長的一篇文章。我必須要道歉：我在標題撒了謊。這篇文章完全不是「淺談」Swift 泛型元編程，而是談論了更多的關於計算的深度內容。但是我想這是作爲一個優秀程序員的基礎知識。

最後，祝願 Swift 泛型元編程不要成爲 iOS 工程師面試內容的一部分。

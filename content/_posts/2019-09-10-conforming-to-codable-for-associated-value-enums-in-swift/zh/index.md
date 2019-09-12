 ---
 title: 在 Swift 中讓 Associated Value Enums 遵從 Codable 協議
 isPublished: false
 ---
 
 ## 理解 Associated Value Enums
 
 爲什麼 Swift 中會有 associated value enums？我的意思是，爲什麼 Swift core team 會設計 associated value enum？

爲了理解這點，首先，讓我們看看下面這個 C 語言的例子：


```c
struct Printer;

struct Scanner;

enum DeviceType {
    DeviceTypePrinter = 0,
    DeviceTypeScanner = 1,
};

struct Device {
    union {
        struct Printer * printer;
        struct Scanner * scanner;
    } pointer;
    enum DeviceType device_type;
};
```

C `struct` `Device` 代表一個設備。其成員 `pointer` 是一個有 `printer` 和 `scanner` 兩個成員的匿名聯結體，其中  `printer` 和 `scanner` 可以幫助我們特化 `pointer` 這個指針的類型；其成員 `device_type` 表示這個 `struct` 儲存着哪種類型的設備指針。

然後我們可以用下列 C 代碼來獲取儲存在這個結構體種的指針：

```c
struct Device device;

Printer * printerPtr = NULL;
Scanner * scannerPtr = NULL;
    
switch (device.device_type) {
    case DeviceTypePrinter:
        printerPtr = device.pointer.printer;
        break;
    case DeviceTypeScanner:
        scannerPtr = device.pointer.scanner;
        break;
}
```

在我描述了上面這個 C `struct` 的意圖之後，你應該可以快速地反應過來，你可以將其表述爲下列 Swift 代碼：

```swift
enum Device {
    printer(Printer)
    scanner(Scanner)
}
```

然後我們可以用下列 Swift 代碼來獲取這個 enum 中儲存的指針：

```swift
let device: Device = .printer(Printer());

var printer: Printer!
var scanner: Scanner!

switch device {
case let .printer(p):
    printer = p
case let .scanner(s):
    scanner = s
}
```

是的。Associated value enum 的設計意圖就是簡化類似之前 `Device` 這樣的 C `struct` 的數據結構的表述和使用的。像 `Device` 這樣的 C `struct` 的數據結構在操作系統的代碼倉庫和其他用 C 寫的基礎設施中無所不在。而像這樣的數據結構也是另一種套用 __多態__ 的途徑。

我說多態。是的，多態。

多態不僅僅是一個存在於物件導向（陸譯：面向對象）世界中的概念。一旦一個實體擁有多種可能的形態，那麼我們就可以說這個實體在套用多態。

由於 associated value enum 爲簡化 plain-old data 的多態表述而設計，我們也可以將 associated value enum 以其他形式的多態來表述——比如說物件導向（陸譯：面向對象）。

## 在物件導向（陸譯：面向對象）世界中表述 Associated Value Enum

爲了在物件導向（陸譯：面向對象）世界中表述 Associated Value Enum，我們能第一個想起的模式是抽象工廠。

是的。實際上，我總是用抽象工廠模式在物件導向（陸譯：面向對象）世界中描述 associated value enum。

對於之前 Swift 的例子中的 `Device` `struct` 而言，我們可以寫出等效的物件導向（陸譯：面向對象）Swift 代碼：

```swift
enum DeviceType {
    printer
    scanner
}

class DeviceObject {
    var type: DeviceType { preconditionFailure("Abstract") }

    var deviceValue: Device { preconditionFailure("Abstract") } 

    static func make(_ device: Device) -> DeviceObject {
        switch device {
            case let .printer(printer): return makePrinter(printer)
            case let .scanner(scanner): return makeScanner(scanner)
        }
    }

    static func makePrinter(_ printer: Printer) -> DeviceObject {
        return PrinterObject(printer: printer)
    }

    static func makeScanner(_ scanner: Scanner) -> DeviceObject {
        return ScannerObject(scanner: scanner)
    }
}

class PrinterObject: DeviceObject {
    override var type: DeviceType { return .printer }

    override var deviceValue: Device { return .printer(printer) }

    let printer: Printer

    init(printer: Printer) {
        self.printer = printer
    }
}

class ScannerObject: DeviceObject {
    override var type: DeviceType { return .scanner }

    override var deviceValue: Device { return .scanner(scanner) }

    let scanner: Scanner

    init(scanner: Scanner) {
        self.scanner = scanner
    }
}
```

於是我們已經以物件導向（陸譯：面向對象）的途徑表述除了一個 associated value enum。

## 遵從 Codable 協議

現在有了 `DeviceObject` 這個 class，遵從 `Codable`  協議已經變得非常簡單了。首先我們要讓 `DeviceObject` 遵從 `Codeable` 協議。

```swift
class DeviceObject: Codable {

    ...

    required init(from decoder: Decoder) throws {
        
    }
    
    func encode(to encoder: Encoder) throws {
        
    }
}

class PrinterObject {

    ...

    private enum _CodingKeys: CodingKey {
        case printer
    }
    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: _CodingKeys.self)
        printer = try container.decode(Printer.self, forKey: .printer)
        super.init(from: decoder)
    }
    
    override func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: _CodingKeys.self)
        try encoder.encode(printer, forKey: .printer)
        super.encode(to: encoder)
    }
}

class ScannerObject {

    ...

    private enum _CodingKeys: CodingKey {
        case scanner
    }
    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: _CodingKeys.self)
        scanner = try container.decode(Scanner.self, forKey: .scanner)
        super.init(from: decoder)
    }
    
    override func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: _CodingKeys.self)
        try encoder.encode(scanner, forKey: .scanner)
        super.encode(to: encoder)
    }
}
```

然後現在我們可以讓 `Device` 服從 `Codable` 協議了。

```swift
enum Device: Codable {

    ...

    required init(from decoder: Decoder) throws {
        let deviceObject = try DeviceObject(from: decoder)
        self = deviceObject.deviceValue
    }
    
    func encode(to encoder: Encoder) throws {
        try DeviceObject.make(device: self).encode(to: encoder)
    }
}
```

最後，收工。
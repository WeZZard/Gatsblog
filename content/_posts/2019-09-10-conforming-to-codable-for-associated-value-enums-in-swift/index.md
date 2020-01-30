---
title: Conforming to Codable for Associated Value Enums in Swift
category: Programming
tags: [Swift, Codable, Associated Value Enum]
---

## Understanding Associated Value Enums

Why there are associated value enums in Swift? I mean, why the Swift core
team designed associated value enum？

To understand it, firstly, let's take a look at the following example in C:

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

The C `struct` `Device` represents a device. The member `pointer` is an
anonymous union which has two members `printer` and `scanner` and can help
specialize the type of the pointer. The member `device_type` indicates
which type of device pointer this `struct` stores.

And then we can get the stored pointer with the following C code:

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

After I've described the purpose of the C `struct` above, you can quick
realize that you can interpret it into Swift like the following code:

```swift
struct Printer {}
struct Scanner {}

enum Device {
    case printer(Printer)
    case scanner(Scanner)
}
```

And we can get the stored pointer with the following Swift code:

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

Yes. The design purpose of associated value enums is just to simplify the
declaration and usage for data structures like the previous `Device`
example in C. Similar C `struct`s like the `Device` `struct` are
ubiquitous in code bases of operating systems or other infrastructures
written in C, which is just another approach exercises __polymorphism__.

I mean polymorphism. Yes, polymorphism.

Polymorphism is not a concept only exists in Object-Oriented world. Once
an entity has multiple potential forms, then we can call this entity
exercises polymorphism.

Since the associated value enum is designed to simply the expression of
polymorphism in plain-old data structure, we can express an associated
value enum with another polymorphism approach -- the Object-Oriented one.

## Expressing Associated Value Enum in Object-Oriented World

The first pattern we can come up with to express an associated value enum
in Object-Oriented World is abstract factory.

Yes. Actually, I always use the abstract factory pattern to illustrate 
associated value enums in Object-Oriented World.

For the `Device` `struct` in Swift which we have shown in the previous
example, we can write an equivalent Object-Oriented Swift code.

```swift
enum DeviceType {
    printer
    scanner
}

class DeviceObject {
    var type: DeviceType { preconditionFailure("Abstract class") }

    var deviceValue: Device { preconditionFailure("Abstract class") } 

    static func make(device: Device) -> DeviceObject {
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

Then we have expressed an associated value enum with the Object-Oriented
approach now.

## Conforming to Codable

With the `DeviceObject` class, conforming to `Codable` comes to be very
easy now. Firstly, we have to make `DeviceObject`  to conform to `Codable`.

```swift
enum DeviceType: UInt8, Codable {
    case printer
    case scanner
}

class DeviceObject: Codable {
    var type: DeviceType { preconditionFailure("Abstract class.") }

    var deviceValue: Device { preconditionFailure("Abstract class.") }

    private enum _CodingKeys: CodingKey {
        case type
    }
    
    init() {
        
    }
    
    required init(from decoder: Decoder) throws {
        
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: _CodingKeys.self)
        try container.encode(type, forKey: .type)
    }

    static func make(device: Device) -> DeviceObject {
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
    
    static func make(decoder: Decoder) throws -> DeviceObject {
        let container = try decoder.container(keyedBy: _CodingKeys.self)
        let deviceType: DeviceType = try container.decode(DeviceType.self, forKey: .type)
        switch deviceType {
            case .printer:
                return try PrinterObject(from: decoder)
            case .scanner:
                return try ScannerObject(from: decoder)
        }
    }
}
```

The key point here is the static function:

```swift
static func make(decoder: Decoder) throws -> DeviceObject
```

This is a factory method for `DeviceObject`.

You may doubt that in ObjectiveC, we often call "factory method" with syntax
like

```objectivec
Foo * foo = [Foo foo];
```

For a concrete example, like `NSCalender`:

```objectivec
NSCalendar * calendar = [NSCalendar calendarWithIdentifier: NSCalendarIdentifierGregorian];
```

returns an instance of type `_NSCopyOnWriteCalendarWrapper`, which is a 
derived class of abstract class `NSCalendar`.

The class method `[NSCalendar +calendarWithIdentifier:]` actually calls
`[NSCalendar +alloc]` on `NSCalendar` firstly and then this function calls
into `[NSCalendar +allocWithZone:]`, then calls the designated initializer
`[NSCalendar -initWithCalendarIdentifier:]` on the returned instance by the
previous method call -- this is what we called two-stage initialization --
the allocation stage and initialization stage, which is often compared with 
the concept "RAII" (resource acquisition is initialization) oftenly used in
C++.

```
  
  +-------------------------------------+
  | NSCalendar +calendarWithIdentifier: |
  +-------------------------------------+
                    |
                    |
                    ˅
           +-------------------+
           | NSCalendar +alloc |
           +-------------------+
                    |
                    |
                    ˅
       +----------------------------+
       | NSCalendar +allocWithZone: | ----------> Allocation
       +----------------------------+
                    |
                    |
                    ˅
+-----------------------------------------+
| NSCalendar -initWithCalendarIdentifier: | ----> Initialization
+-----------------------------------------+

```

To return an instance with derrived class of the abstract class, here is 
`NSCalendar`, we need to dispatch the returned instance in the allocation 
stage, which is `[NSCalendar +allocWithZone:]`. But since Swift keeps the 
allocation stage "under-the-hood", we are no longer able to do that way when
migrated to Swift.

Thus we use a dedicated static function as a "factory method". And since 
`DeviceObject` is an abstract class, the designated initializer `init()`
and `init(from:)` does nothing here (Yes, because that they are
initializers).

Then implement `Codable` in `DeviceObject`'s derived classes.

```swift
class PrinterObject: DeviceObject {
    private enum _CodingKeys: CodingKey {
        case printer
    }

    override var type: DeviceType { return .printer }

    override var deviceValue: Device { return .printer(printer) }

    let printer: Printer

    init(printer: Printer) {
        self.printer = printer
        super.init()
    }

    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: _CodingKeys.self)
        printer = try container.decode(Printer.self, forKey: .printer)
        
        try super.init(from: decoder)
    }

    override func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: _CodingKeys.self)
        try container.encode(printer, forKey: .printer)

        try super.encode(to: encoder)
    }
}

class ScannerObject: DeviceObject {
    private enum _CodingKeys: CodingKey {
        case scanner
    }

    override var type: DeviceType { return .scanner }

    override var deviceValue: Device { return .scanner(scanner) }

    let scanner: Scanner

    init(scanner: Scanner) {
        self.scanner = scanner
        super.init()
    }

    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: _CodingKeys.self)
        scanner = try container.decode(Scanner.self, forKey: .scanner)

        try super.init(from: decoder)
    }

    override func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: _CodingKeys.self)
        try container.encode(scanner, forKey: .scanner)

        try super.encode(to: encoder)
    }
}
```

Then we can make `Device` to conform to `Codable` now.

```swift
extension Printer: Codable {}
extension Scanner: Codable {}

extension Device: Codable {
    init(from decoder: Decoder) throws {
        let deviceObject = try DeviceObject.make(decoder: decoder)
        self = deviceObject.deviceValue
    }
    
    func encode(to encoder: Encoder) throws {
        try DeviceObject.make(device: self).encode(to: encoder)
    }
}
```

Finally, all things done.
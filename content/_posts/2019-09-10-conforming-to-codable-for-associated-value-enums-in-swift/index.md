---
title: Conforming to Codable for Associated Value Enums in Swift
category: Programming
tags: [Swift, Codable, Associated Value Enum]
---

## Understanding Associated Value Enums

Why there are associated value enums in Swift? I mean, why the Swift core
team designed associated value enums.

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
enum Device {
    printer(Printer)
    scanner(Scanner)
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
    var type: DeviceType { return .printer }

    var deviceValue: Device { return .printer(printer) }

    let printer: Printer

    init(printer: Printer) {
        self.printer = printer
    }
}

class ScannerObject: DeviceObject {
    var type: DeviceType { return .scanner }

    var deviceValue: Device { return .scanner(scanner) }

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

Then we can make `Device` to conform to `Codable` now.

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

Finally, all things done.
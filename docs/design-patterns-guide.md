# Design Patterns Guide

## Introduction
Design patterns are reusable solutions to common problems in software design. This guide covers the most important patterns categorized by their purpose and usage.

## Creational Patterns

### Singleton
```typescript
class Database {
    private static instance: Database;
    private constructor() {}

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
```

### Factory Method
```typescript
interface Animal {
    speak(): string;
}

class Dog implements Animal {
    speak(): string {
        return "Woof!";
    }
}

class Cat implements Animal {
    speak(): string {
        return "Meow!";
    }
}

class AnimalFactory {
    createAnimal(type: string): Animal {
        switch (type) {
            case "dog":
                return new Dog();
            case "cat":
                return new Cat();
            default:
                throw new Error("Unknown animal type");
        }
    }
}
```

### Abstract Factory
```typescript
interface Button {
    render(): void;
}

interface Checkbox {
    toggle(): void;
}

interface GUIFactory {
    createButton(): Button;
    createCheckbox(): Checkbox;
}

class WindowsFactory implements GUIFactory {
    createButton(): Button {
        return new WindowsButton();
    }
    createCheckbox(): Checkbox {
        return new WindowsCheckbox();
    }
}

class MacFactory implements GUIFactory {
    createButton(): Button {
        return new MacButton();
    }
    createCheckbox(): Checkbox {
        return new MacCheckbox();
    }
}
```

### Builder
```typescript
class Pizza {
    constructor() {
        this.toppings = [];
    }
    addTopping(topping: string) {
        this.toppings.push(topping);
    }
}

class PizzaBuilder {
    constructor() {
        this.pizza = new Pizza();
    }

    addCheese() {
        this.pizza.addTopping("cheese");
        return this;
    }

    addPepperoni() {
        this.pizza.addTopping("pepperoni");
        return this;
    }

    build() {
        return this.pizza;
    }
}
```

## Structural Patterns

### Adapter
```typescript
interface Target {
    request(): string;
}

class Adaptee {
    specificRequest(): string {
        return "Specific request";
    }
}

class Adapter implements Target {
    constructor(private adaptee: Adaptee) {}

    request(): string {
        return this.adaptee.specificRequest();
    }
}
```

### Decorator
```typescript
interface Coffee {
    cost(): number;
    description(): string;
}

class SimpleCoffee implements Coffee {
    cost(): number {
        return 10;
    }
    description(): string {
        return "Simple coffee";
    }
}

class MilkDecorator implements Coffee {
    constructor(private coffee: Coffee) {}

    cost(): number {
        return this.coffee.cost() + 2;
    }
    description(): string {
        return this.coffee.description() + ", milk";
    }
}
```

### Composite
```typescript
abstract class FileSystemItem {
    constructor(protected name: string) {}
    abstract getSize(): number;
}

class File extends FileSystemItem {
    constructor(name: string, private size: number) {
        super(name);
    }
    getSize(): number {
        return this.size;
    }
}

class Directory extends FileSystemItem {
    private items: FileSystemItem[] = [];

    add(item: FileSystemItem): void {
        this.items.push(item);
    }
    getSize(): number {
        return this.items.reduce((sum, item) => sum + item.getSize(), 0);
    }
}
```

## Behavioral Patterns

### Observer
```typescript
interface Observer {
    update(data: any): void;
}

class Subject {
    private observers: Observer[] = [];

    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    notify(data: any): void {
        this.observers.forEach(observer => observer.update(data));
    }
}
```

### Strategy
```typescript
interface PaymentStrategy {
    pay(amount: number): void;
}

class CreditCardPayment implements PaymentStrategy {
    pay(amount: number): void {
        console.log(`Paid ${amount} using Credit Card`);
    }
}

class PayPalPayment implements PaymentStrategy {
    pay(amount: number): void {
        console.log(`Paid ${amount} using PayPal`);
    }
}

class ShoppingCart {
    constructor(private paymentStrategy: PaymentStrategy) {}

    checkout(amount: number): void {
        this.paymentStrategy.pay(amount);
    }
}
```

### Command
```typescript
interface Command {
    execute(): void;
}

class Light {
    turnOn(): void {
        console.log("Light is on");
    }
    turnOff(): void {
        console.log("Light is off");
    }
}

class LightOnCommand implements Command {
    constructor(private light: Light) {}

    execute(): void {
        this.light.turnOn();
    }
}

class RemoteControl {
    private command: Command;

    setCommand(command: Command): void {
        this.command = command;
    }

    pressButton(): void {
        this.command.execute();
    }
}
```

## Architectural Patterns

### MVC (Model-View-Controller)
```typescript
class UserModel {
    private name: string;
    
    setName(name: string): void {
        this.name = name;
    }
    
    getName(): string {
        return this.name;
    }
}

class UserView {
    display(name: string): void {
        console.log(`User name: ${name}`);
    }
}

class UserController {
    constructor(
        private model: UserModel,
        private view: UserView
    ) {}

    setName(name: string): void {
        this.model.setName(name);
        this.view.display(this.model.getName());
    }
}
```

### MVVM (Model-View-ViewModel)
```typescript
class UserModel {
    constructor(public name: string) {}
}

class UserViewModel {
    private model: UserModel;
    
    constructor(model: UserModel) {
        this.model = model;
    }
    
    get displayName(): string {
        return `User: ${this.model.name}`;
    }
}

class UserView {
    constructor(private viewModel: UserViewModel) {}
    
    render(): void {
        console.log(this.viewModel.displayName);
    }
}
```

## Best Practices

### SOLID Principles
1. Single Responsibility
```typescript
// Good
class UserManager {
    saveUser(user: User): void {
        // Save user logic
    }
}

class EmailService {
    sendEmail(user: User): void {
        // Send email logic
    }
}
```

2. Open/Closed
```typescript
interface Shape {
    area(): number;
}

class Rectangle implements Shape {
    constructor(
        private width: number,
        private height: number
    ) {}

    area(): number {
        return this.width * this.height;
    }
}
```

3. Liskov Substitution
```typescript
class Bird {
    fly(): void {
        // Base flying behavior
    }
}

class Sparrow extends Bird {
    fly(): void {
        // Sparrow-specific flying
    }
}
```

4. Interface Segregation
```typescript
interface Printable {
    print(): void;
}

interface Scannable {
    scan(): void;
}

class AllInOnePrinter implements Printable, Scannable {
    print(): void {
        // Print implementation
    }
    scan(): void {
        // Scan implementation
    }
}
```

5. Dependency Inversion
```typescript
interface Logger {
    log(message: string): void;
}

class ConsoleLogger implements Logger {
    log(message: string): void {
        console.log(message);
    }
}

class UserService {
    constructor(private logger: Logger) {}

    createUser(user: User): void {
        // Create user
        this.logger.log("User created");
    }
}
```

## Additional Resources

### Documentation
- Design Patterns (GoF)
- Head First Design Patterns
- Refactoring Guru

### Tools
- UML diagrams
- Code generators
- Refactoring tools
- Static analyzers

## Glossary

### Common Terms
- **Pattern**: Reusable solution
- **Abstraction**: Simplification
- **Encapsulation**: Information hiding
- **Inheritance**: Code reuse
- **Polymorphism**: Multiple forms
- **Coupling**: Dependency degree
- **Cohesion**: Module focus
- **Composition**: Object combination

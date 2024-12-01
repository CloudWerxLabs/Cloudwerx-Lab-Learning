# TypeScript Guide

## Introduction to TypeScript
TypeScript is a strongly typed programming language that builds on JavaScript. This guide covers fundamental to advanced concepts.

## Basic Types

### Primitive Types
```typescript
// Basic types
let isDone: boolean = false
let decimal: number = 6
let color: string = "blue"
let list: number[] = [1, 2, 3]
let tuple: [string, number] = ["hello", 10]
let nullValue: null = null
let undefinedValue: undefined = undefined
```

### Object Types
```typescript
// Object type
let obj: object = { key: "value" }

// Specific object type
let point: { x: number; y: number } = { x: 10, y: 20 }

// Optional properties
type User = {
  name: string
  age?: number  // Optional
}
```

### Arrays and Tuples
```typescript
// Array types
let numbers: number[] = [1, 2, 3]
let strings: Array<string> = ["a", "b", "c"]

// Tuple types
let tuple: [string, number] = ["hello", 42]
let tupleWithOptional: [string, number?] = ["hello"]
```

## Interfaces

### Basic Interface
```typescript
interface User {
  name: string
  age: number
  email?: string  // Optional property
  readonly id: number  // Read-only property
}

const user: User = {
  name: "John",
  age: 30,
  id: 1
}
```

### Interface Extension
```typescript
interface Animal {
  name: string
}

interface Dog extends Animal {
  breed: string
}

const dog: Dog = {
  name: "Rex",
  breed: "German Shepherd"
}
```

### Function Interfaces
```typescript
interface MathFunc {
  (x: number, y: number): number
}

const add: MathFunc = (x, y) => x + y
const subtract: MathFunc = (x, y) => x - y
```

## Types

### Type Aliases
```typescript
type Point = {
  x: number
  y: number
}

type ID = string | number

type Callback = (data: string) => void
```

### Union Types
```typescript
type Status = "pending" | "approved" | "rejected"

function processStatus(status: Status) {
  switch (status) {
    case "pending": return "Processing"
    case "approved": return "Success"
    case "rejected": return "Failed"
  }
}
```

### Intersection Types
```typescript
type Employee = {
  id: number
  name: string
}

type Manager = {
  department: string
}

type ManagerWithEmployee = Employee & Manager

const manager: ManagerWithEmployee = {
  id: 1,
  name: "John",
  department: "IT"
}
```

## Functions

### Function Types
```typescript
// Function type definition
function add(x: number, y: number): number {
  return x + y
}

// Arrow function with type
const multiply = (x: number, y: number): number => x * y

// Optional and default parameters
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}`
}
```

### Generic Functions
```typescript
function identity<T>(arg: T): T {
  return arg
}

// Usage
let output = identity<string>("myString")
let output2 = identity(123)  // Type inference
```

### Function Overloads
```typescript
function makeDate(timestamp: number): Date
function makeDate(year: number, month: number, day: number): Date
function makeDate(timestampOrYear: number, month?: number, day?: number): Date {
  if (month !== undefined && day !== undefined) {
    return new Date(timestampOrYear, month - 1, day)
  } else {
    return new Date(timestampOrYear)
  }
}
```

## Classes

### Basic Class
```typescript
class Animal {
  private name: string
  protected age: number
  
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  
  public makeSound(): void {
    console.log("Some sound")
  }
}
```

### Class Inheritance
```typescript
class Dog extends Animal {
  constructor(name: string, age: number) {
    super(name, age)
  }
  
  public makeSound(): void {
    console.log("Woof!")
  }
}
```

### Abstract Classes
```typescript
abstract class Shape {
  abstract getArea(): number
  
  getPerimeter(): number {
    return 0
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super()
  }
  
  getArea(): number {
    return Math.PI * this.radius ** 2
  }
}
```

## Generics

### Generic Classes
```typescript
class Queue<T> {
  private data: T[] = []
  
  push(item: T) {
    this.data.push(item)
  }
  
  pop(): T | undefined {
    return this.data.shift()
  }
}

const numberQueue = new Queue<number>()
```

### Generic Constraints
```typescript
interface Lengthwise {
  length: number
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}
```

### Generic Utility Types
```typescript
// Partial
type PartialPoint = Partial<Point>

// Readonly
type ReadonlyUser = Readonly<User>

// Pick
type NameOnly = Pick<User, "name">

// Record
type PageInfo = Record<string, { title: string }>
```

## Advanced Types

### Mapped Types
```typescript
type Optional<T> = {
  [P in keyof T]?: T[P]
}

type ReadOnly<T> = {
  readonly [P in keyof T]: T[P]
}
```

### Conditional Types
```typescript
type NonNullable<T> = T extends null | undefined ? never : T

type ExtractType<T> = T extends string ? string : number
```

### Index Types
```typescript
type Index = "a" | "b" | "c"
type FromIndex = { [k in Index]?: number }

type FromSomeObject = { [key in keyof User]: string }
```

## Decorators

### Class Decorators
```typescript
function sealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@sealed
class Example {
  // ...
}
```

### Method Decorators
```typescript
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // Add logging here
}

class Example {
  @log
  method() {
    // Method implementation
  }
}
```

## Best Practices

### Type Safety
1. Use strict mode
2. Avoid any type
3. Use proper type declarations
4. Implement proper error handling
5. Use type guards

### Code Organization
1. Follow naming conventions
2. Use proper file structure
3. Implement proper interfaces
4. Use proper type exports
5. Document complex types

### Performance
1. Use proper type inference
2. Avoid excessive type complexity
3. Optimize imports
4. Use proper build configuration
5. Implement proper bundling

## Debugging

### Tools
1. VS Code debugging
2. TypeScript compiler
3. TSLint/ESLint
4. Source maps
5. Type checking

### Common Issues
1. Type conflicts
2. Interface compatibility
3. Generic constraints
4. Decorator issues
5. Build configuration

Remember: TypeScript adds static typing to JavaScript. Focus on proper type definitions and interfaces for type-safe applications.

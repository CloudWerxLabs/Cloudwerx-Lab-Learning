# TypeScript Complete Guide

## Basic Types and Features

### 1. Basic Types
```typescript
// Primitive types
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];
let u: undefined = undefined;
let n: null = null;

// Special types
let notSure: any = 4;
let unknown: unknown = "hello";
let never: never;
let void: void = undefined;

// Object type
let obj: object = { key: "value" };

// Literal types
let literal: "hello" | "world";
let num: 1 | 2 | 3;
```

### 2. Interfaces
```typescript
// Basic interface
interface User {
    name: string;
    age: number;
    email?: string;  // Optional property
    readonly id: number;  // Read-only property
}

// Extending interfaces
interface Employee extends User {
    role: string;
    department: string;
}

// Function interface
interface SearchFunc {
    (source: string, subString: string): boolean;
}

// Class interface
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date): void;
}

// Index signature
interface StringArray {
    [index: number]: string;
}
```

### 3. Classes
```typescript
// Basic class
class Animal {
    private name: string;
    protected age: number;
    readonly species: string;

    constructor(name: string, age: number, species: string) {
        this.name = name;
        this.age = age;
        this.species = species;
    }

    public makeSound(): void {
        console.log("Some sound");
    }
}

// Class inheritance
class Dog extends Animal {
    constructor(name: string, age: number) {
        super(name, age, "Canis");
    }

    public makeSound(): void {
        console.log("Woof!");
    }
}

// Abstract class
abstract class Shape {
    abstract getArea(): number;
    
    getPerimeter(): number {
        return 0;
    }
}
```

### 4. Functions
```typescript
// Function types
function add(x: number, y: number): number {
    return x + y;
}

// Optional and default parameters
function buildName(firstName: string, lastName?: string): string {
    return lastName ? `${firstName} ${lastName}` : firstName;
}

// Rest parameters
function sum(...numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0);
}

// Function overloads
function process(x: number): number;
function process(x: string): string;
function process(x: any): any {
    return x;
}

// Generic function
function identity<T>(arg: T): T {
    return arg;
}
```

## Advanced Features

### 1. Generics
```typescript
// Generic classes
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

// Generic constraints
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

// Generic interfaces
interface GenericIdentityFn<T> {
    (arg: T): T;
}

// Generic type aliases
type Container<T> = { value: T };
```

### 2. Decorators
```typescript
// Class decorator
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

// Method decorator
function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}

// Property decorator
function format(formatString: string) {
    return function (target: any, propertyKey: string) {
        let value = target[propertyKey];

        const getter = function() {
            return `${formatString} ${value}`;
        };

        const setter = function(newVal: string) {
            value = newVal;
        };

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    };
}
```

### 3. Advanced Types
```typescript
// Union types
type StringOrNumber = string | number;

// Intersection types
type Combined = { a: string } & { b: number };

// Type guards
function isString(x: any): x is string {
    return typeof x === "string";
}

// Mapped types
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

type Partial<T> = {
    [P in keyof T]?: T[P];
};

// Conditional types
type TypeName<T> = 
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object";
```

### 4. Utility Types
```typescript
// Partial
interface Todo {
    title: string;
    description: string;
}
type PartialTodo = Partial<Todo>;

// Readonly
type ReadonlyTodo = Readonly<Todo>;

// Record
type PageInfo = Record<string, { url: string }>;

// Pick
type TodoPreview = Pick<Todo, "title">;

// Omit
type TodoInfo = Omit<Todo, "description">;

// Exclude
type T0 = Exclude<"a" | "b" | "c", "a">;

// Extract
type T1 = Extract<"a" | "b" | "c", "a" | "f">;

// NonNullable
type T2 = NonNullable<string | number | undefined | null>;
```

## Configuration and Tools

### 1. TSConfig
```json
{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "outDir": "./dist",
        "rootDir": "./src",
        "declaration": true,
        "sourceMap": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "**/*.spec.ts"]
}
```

### 2. Build Tools
```typescript
// Webpack configuration for TypeScript
module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
```

## Testing and Debugging

### 1. Jest Configuration
```typescript
// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};

// Example test
describe('Calculator', () => {
    it('should add numbers correctly', () => {
        expect(add(1, 2)).toBe(3);
    });
});
```

### 2. Debugging
```typescript
// Source map support
{
    "compilerOptions": {
        "sourceMap": true,
        "inlineSourceMap": false
    }
}

// Debug configuration for VS Code
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug Program",
            "program": "${workspaceFolder}/src/index.ts",
            "preLaunchTask": "tsc: build - tsconfig.json",
            "outFiles": ["${workspaceFolder}/dist/**/*.js"]
        }
    ]
}
```

## Best Practices

### 1. Code Organization
```typescript
// Barrel exports
// index.ts
export * from './user.model';
export * from './user.service';
export * from './user.controller';

// Clean imports
import { User, UserService } from './user';
```

### 2. Error Handling
```typescript
// Custom error types
class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

// Error handling with types
function processData(data: unknown): void {
    try {
        if (typeof data !== 'string') {
            throw new ValidationError('Data must be a string');
        }
        // Process data
    } catch (error) {
        if (error instanceof ValidationError) {
            console.error('Validation failed:', error.message);
        } else {
            console.error('Unknown error:', error);
        }
    }
}
```

## Learning Resources

### 1. Official Documentation
- TypeScript Handbook
- TypeScript Release Notes
- TypeScript Playground
- TypeScript Deep Dive

### 2. Recommended Books
- "Programming TypeScript" by Boris Cherny
- "Effective TypeScript" by Dan Vanderkam
- "TypeScript in 50 Lessons" by Stefan Baumgartner

### 3. Online Courses
1. TypeScript Fundamentals
2. Advanced TypeScript
3. TypeScript Design Patterns
4. Full Stack TypeScript

### 4. Practice Projects
1. REST API with TypeScript
2. React + TypeScript App
3. Node.js + TypeScript Server
4. TypeScript Library
5. Full Stack TypeScript Project

### 5. Community Resources
- TypeScript GitHub
- DefinitelyTyped
- TypeScript Discord
- Stack Overflow
- Dev.to TypeScript tag

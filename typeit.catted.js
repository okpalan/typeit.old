/**
 * @name TypeIt
 * @description TypeIt is a static, functional type checker for JavaScript. It uses regex-based runtime type
 * assertions to validate types dynamically while minimizing performance overhead. Designed with a data-oriented,
 * functional programming philosophy, TypeIt ensures type safety in both browser and Node.js environments.
 * @version 0.0.0
 * @author Nnamdi Michael Okpala
 * @license MIT
 */

// Enum for traversal types
export const TraversalType = Object.freeze({
    BFS: "bfs",
    DFS: "dfs"
});

// Primitive Types Enum
export const PrimitiveTypes = Object.freeze({
    STRING: "string",
    NUMBER: "number",
    BOOLEAN: "boolean",
    FUNCTION: "function",
    NULL: "null",
    UNDEFINED: "undefined",
    SYMBOL: "symbol",
    BIGINT: "bigint",
    VOID: "void",
    NEVER: "never"
});

// Complex Types Enum (Computed Types)
export const ComplexTypes = Object.freeze({
    ARRAY: "array",
    OBJECT: "object",
    DATE: "date",
    REGEXP: "regexp",
    MAP: "map",
    SET: "set",
    PROMISE: "promise",
    ITERABLE: "iterable",
    FILE: "file",
    BLOB: "blob",
    EMAIL: "email",
    PHONE: "phone",
    URL: "url"
});

// Type checking function for computed types (e.g., regex-based checks)
export const typeCheckers = {
    isEmail: (value) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    isPhone: (value) => /^\+?[1-9]\d{1,14}$/.test(value),
    isUrl: (value) => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value)
};


export function assertType(value, typeChecker) {
    if (!typeChecker(value)) {
        throw new Error(`Type assertion failed for value: ${value}`);
    }
    return value;
}

// Combined Types for easy access (simple types and computed types)
export const Types = Object.freeze({
    ...PrimitiveTypes,
    ...ComplexTypes
});

/**
 * Higher-order function to create flexible type-check functions.
 * Supports traditional usage with `call`, `apply`, and `bind`.
 */
export const createChecker = (typeCheckFunc) => {
    return function (...args) {
        try {
            return typeCheckFunc.apply(this, args);
        } catch (e) {
            console.error(`Type check function failed: ${e.message}`);
            return false;  // Return false on error
        }
    };
};

/**
 * Factory function to initialize an object with options and higher-order functional support.
 * @param {Object} options - An object containing val, idx, and array.
 * @returns {Object} The composed object with higher-order helper functions.
 */
export function compose(options = { val: null, idx: 0, array: [] }) {
    const { val, idx, array } = options;

    return {
        val,
        idx,
        array,
        ...typeCheckers
    };
}

// BDD-Style Helper Function
export const assert = (condition, message) => {
    if (!condition) {
        throw new Error(message);
    }
};
// Type Guard to assert that the value is an array-like structure
const isArrayLike = (value) => Array.isArray(value);

// TypeGuard Class
class TypeGuard {
    constructor(initialValues = []) {
        if (!isArrayLike(initialValues)) {
            throw new TypeError('Initial values must be an array-like structure');
        }
        this.data = initialValues;
    }

    // TypeGuard to check if an element matches a given type
    typeGuard(value, expectedType) {
        if (typeof value !== expectedType) {
            throw new TypeError(`Expected type ${expectedType}, but received ${typeof value}`);
        }
    }

    // Push method optimized for performance
    push(element) {
        this.typeGuard(element, "number");  // Assuming we want numbers in this case
        this.data.push(element);
        return this;
    }

    // Pop method optimized for performance
    pop() {
        const element = this.data.pop();
        return element;
    }

    // Insert element at a specific index with type safety
    insertAt(index, element) {
        if (index < 0 || index > this.data.length) {
            throw new RangeError('Index out of bounds');
        }
        this.typeGuard(element, "number");  // Assuming we want numbers in this case
        this.data.splice(index, 0, element);
        return this;
    }

    // Remove element at a specific index
    removeAt(index) {
        if (index < 0 || index >= this.data.length) {
            throw new RangeError('Index out of bounds');
        }
        return this.data.splice(index, 1)[0];
    }

    // Get element at a specific index
    at(index) {
        return this.data[index];
    }

    // Length of the collection
    length() {
        return this.data.length;
    }

    // Check if the collection contains a value
    contains(value) {
        return this.data.includes(value);
    }

    // Map operation to apply function to each element
    map(callback) {
        const newArray = this.data.map(callback);
        return new TypeGuard(newArray);
    }

    // Filter operation to keep elements matching condition
    filter(callback) {
        const newArray = this.data.filter(callback);
        return new TypeGuard(newArray);
    }

    // Reduce operation to accumulate a single result
    reduce(callback, initialValue) {
        return this.data.reduce(callback, initialValue);
    }

    // ForEach operation (no return value)
    forEach(callback) {
        this.data.forEach(callback);
    }

    // Cloning the container
    clone() {
        return new TypeGuard([...this.data]);
    }

    // Custom error assertion for type checking
    assertType(element, expectedType) {
        if (typeof element !== expectedType) {
            throw new TypeError(`Expected type ${expectedType}, but received ${typeof element}`);
        }
    }

    // Print the container as a string
    toString() {
        return `[${this.data.join(', ')}]`;
    }
}

// Example Usage

const container = new TypeGuard([10, 20, 30]);

// Pushing an element (type-checked)
container.push(40);  // Valid type
try {
    container.push("string");  // Error: type mismatch
} catch (e) {
    console.log(e.message); // TypeError: Expected type number, but received string
}

// Inserting at index
container.insertAt(1, 15);
console.log(container.toString()); // [10, 15, 20, 30, 40]

// Removing at index
container.removeAt(2);
console.log(container.toString()); // [10, 15, 30, 40]

// Type assertion and checking
container.assertType(20, "number"); // No error
try {
    container.assertType("not a number", "number");  // TypeError
} catch (e) {
    console.log(e.message); // Expected type number, but received string
}

// Iterating and transforming with map
const transformed = container.map(x => x * 2);
console.log(transformed.toString()); // [20, 30, 60, 80]

// Reduce example
const sum = container.reduce((acc, val) => acc + val, 0);
console.log(sum); // 95

import { Types, assertType } from '.'; // Import Types and assertion function

// Enum for traversal types
export const TraversalType = Object.freeze({
    BFS: "bfs",
    DFS: "dfs"
});

// BFS (Breadth-First Search) Traversal
export function bfsTraversal(obj, typeEnum) {
    const queue = [obj];
    const result = [];

    while (queue.length > 0) {
        let item = queue.shift();

        if (Array.isArray(item)) {
            queue.push(...item);
        } else if (typeof item === 'object' && item !== null) {
            queue.push(...Object.values(item));
        } else {
            if (typeEnum.isString(item)) result.push(item);
            else if (typeEnum.isNumber(item)) result.push(item);
            else if (typeEnum.isBoolean(item)) result.push(item);
            else if (typeEnum.isRegExp(item)) result.push(item);
        }
    }
    return result;
}

// DFS (Depth-First Search) Traversal
export function dfsTraversal(obj, typeEnum) {
    const stack = [obj];
    const result = [];

    while (stack.length > 0) {
        let item = stack.pop();

        if (Array.isArray(item)) {
            stack.push(...item);
        } else if (typeof item === 'object' && item !== null) {
            stack.push(...Object.values(item));
        } else {
            if (typeEnum.isString(item)) result.push(item);
            else if (typeEnum.isNumber(item)) result.push(item);
            else if (typeEnum.isBoolean(item)) result.push(item);
            else if (typeEnum.isRegExp(item)) result.push(item);
        }
    }
    return result;
}

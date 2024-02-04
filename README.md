# Flinq

[![npm version](https://badge.fury.io/js/flinq.svg)](https://www.npmjs.com/package/flinq)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Flinq is a powerful TypeScript library inspired by LINQ, offering a seamless and type-safe way to query and manipulate collections. With Flinq, you can write expressive and readable code to filter, transform, aggregate, and perform various operations on arrays and other iterable data structures. Enjoy the benefits of a fluent API, strong type checking, and a rich set of LINQ-like methods in your TypeScript projects.

## Installation

Install Flinq using npm:

```bash
npm install flinq
```
## Usage

```typescript
import { Flinq, Queryable } from 'flinq';

interface Person {
    id: number;
    name: string;
    age: number;
}

const data: Person[] = [
    { id: 1, name: 'John', age: 25 },
    { id: 2, name: 'Alice', age: 30 },
    // Add more data
];

const result = new Flinq.Queryable(data)
    .where(person => person.age > 22)
    .orderBy(person => person.age)
    .select(person => person.name)
    .toArray();

console.log(result);
// Output: ['John', 'Alice']
```

## Features
### Fluent API:
 Write chainable, expressive queries with a fluent syntax.
### Strong Typing:
 Benefit from TypeScript's type checking for increased safety.
### LINQ-Inspired Methods:
 A rich set of LINQ-like methods for querying and manipulating collections.
### Aggregation and Quantifiers:
 Easily perform aggregation operations and check quantifiers.
### Set Operations:
 Perform set operations such as union, intersect, and except.
### Partitioning and Concatenation:
 Implement partitioning and concatenation methods.


## Documentation
For detailed documentation and examples, visit the Flinq Documentation.

## Contributing
We welcome contributions! See CONTRIBUTING.md for more information.

## License
Flinq is released under the MIT License.

## Acknowledgments
Flinq is inspired by the LINQ library for C#.

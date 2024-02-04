// namespace Flinq {
    export class Queryable<T> {
        private collection: T[];

        constructor(collection: T[]) {
            this.collection = collection || [];
        }

        // Method to get the collection
        getCollection(): T[] {
            return this.collection;
        }

        // Select operation to project each element of the collection
        select<U>(selector: (item: T) => U): Queryable<U> {
            return new Queryable<U>(this.collection.map(selector));
        }

        // Where operation to filter elements based on a condition
        where(predicate: (item: T) => boolean): Queryable<T> {
            return new Queryable<T>(this.collection.filter(predicate));
        }

        // OrderBy operation to sort elements
        orderBy(keySelector: (item: T) => any): Queryable<T> {
            return new Queryable<T>([...this.collection].sort((a, b) => {
                const keyA = keySelector(a);
                const keyB = keySelector(b);
                return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
            }));
        }

        // GroupBy operation
        groupBy<K>(keySelector: (item: T) => K): Map<K, T[]> {
            const groups = new Map<K, T[]>();
            this.collection.forEach(item => {
                const key = keySelector(item);
                if (!groups.has(key)) {
                    groups.set(key, []);
                }
                groups.get(key)?.push(item);
            });
            return groups;
        }

        // Join operation
        join<U, K>(inner: U[], outerKeySelector: (item: T) => K, innerKeySelector: (item: U) => K): Queryable<{ outer: T, inner: U }> {
            const result: { outer: T, inner: U }[] = [];
            this.collection.forEach(outerItem => {
                const outerKey = outerKeySelector(outerItem);
                const innerMatches = inner.filter(innerItem => innerKeySelector(innerItem) === outerKey);
                innerMatches.forEach(innerItem => {
                    result.push({ outer: outerItem, inner: innerItem });
                });
            });
            return new Queryable<{ outer: T, inner: U }>(result);
        }

        // Aggregation methods

        count(): number {
            return this.collection.length;
        }

        sum(selector: (item: T) => number): number {
            return this.collection.reduce((acc, curr) => acc + selector(curr), 0);
        }

        min(selector: (item: T) => any): T | undefined {
            return this.collection.reduce((min, curr) => {
                const minValue = selector(min!);
                const currValue = selector(curr);
                return minValue < currValue ? min : curr;
            }, this.collection[0]);
        }

        max(selector: (item: T) => any): T | undefined {
            return this.collection.reduce((max, curr) => {
                const maxValue = selector(max!);
                const currValue = selector(curr);
                return maxValue > currValue ? max : curr;
            }, this.collection[0]);
        }

        average(selector: (item: T) => number): number {
            const sum = this.sum(selector);
            return this.count() > 0 ? sum / this.count() : 0;
        }

        // Quantifier methods

        any(predicate: (item: T) => boolean): boolean {
            return this.collection.some(predicate);
        }

        all(predicate: (item: T) => boolean): boolean {
            return this.collection.every(predicate);
        }


        // Element Operations methods

        firstOrDefault(defaultValue?: T): T | undefined {
            return this.collection.length > 0 ? this.collection[0] : defaultValue;
        }

        lastOrDefault(defaultValue?: T): T | undefined {
            return this.collection.length > 0 ? this.collection[this.collection.length - 1] : defaultValue;
        }

        singleOrDefault(defaultValue?: T): T | undefined {
            return this.collection.length === 1 ? this.collection[0] : defaultValue;
        }

        // Set Operations methods

        distinct(): Queryable<T> {
            return new Queryable<T>([...new Set(this.collection)]);
        }

        union(other: T[]): Queryable<T> {
            return new Queryable<T>([...new Set([...this.collection, ...other])]);
        }

        intersect(other: T[]): Queryable<T> {
            return new Queryable<T>([...new Set(this.collection.filter(item => other.includes(item)))]);
        }

        except(other: T[]): Queryable<T> {
            return new Queryable<T>([...new Set(this.collection.filter(item => !other.includes(item)))]);
        }

        // Partitioning methods

        // Take operation
        take(count: number): Queryable<T> {
            return new Queryable<T>(this.collection.slice(0, count));
        }

        // Skip operation
        skip(count: number): Queryable<T> {
            return new Queryable<T>(this.collection.slice(count));
        }

        // Concatenation method

        concat(other: T[]): Queryable<T> {
            return new Queryable<T>([...this.collection, ...other]);
        }

        // Conversion methods

        toArray(): T[] {
            return [...this.collection];
        }

        toList(): T[] {
            return this.toArray();
        }

        toDictionary(keySelector: (item: T) => any): Map<any, T> {
            const dictionary = new Map<any, T>();
            this.collection.forEach(item => {
                const key = keySelector(item);
                dictionary.set(key, item);
            });
            return dictionary;
        }
    }
// }


interface Person {
    id: number;
    name: string;
    age: number;
}

// Example usage:
// Example data
const data: Person[] = [
    { id: 1, name: 'John', age: 25 },
    { id: 2, name: 'Alice', age: 30 },
    { id: 3, name: 'Bob', age: 22 },
    { id: 4, name: 'Sophie', age: 22 },
    { id: 5, name: 'Sara', age: 29 },
];

// Example 1: Filtering and Projection
const result1 = new Queryable(data)
    .where(person => person.age > 22)
    .orderBy(person => person.age)
    .select(person => person.name)
    .getCollection();

console.log(result1);
// Output: ['Bob', 'Sophie', 'Sara']

// Example 2: Aggregation
const count = new Queryable(data).count();
const sumAges = new Queryable(data).sum(person => person.age);
const minAge = new Queryable(data).min(person => person.age);
const maxAge = new Queryable(data).max(person => person.age);
const averageAge = new Queryable(data).average(person => person.age);

console.log(`Count: ${count}`);
console.log(`Sum of Ages: ${sumAges}`);
console.log(`Min Age: ${minAge?.age}`);
console.log(`Max Age: ${maxAge?.age}`);
console.log(`Average Age: ${averageAge}`);

// Example 3: Quantifiers
const anyOver30 = new Queryable(data).any(person => person.age > 30);
const allOver20 = new Queryable(data).all(person => person.age > 20);

console.log(`Any person over 30: ${anyOver30}`);
console.log(`All persons over 20: ${allOver20}`);

// Example 4: Element Operations
const firstPerson = new Queryable(data).firstOrDefault();
const lastPerson = new Queryable(data).lastOrDefault();
const singlePerson = new Queryable(data).singleOrDefault({ id: 6, name: 'Mostafa', age: 31 });

console.log(`First Person: ${JSON.stringify(firstPerson)}`);
console.log(`Last Person: ${JSON.stringify(lastPerson)}`);
console.log(`Single Person (Alice): ${JSON.stringify(singlePerson)}`);

// Example 5: Set Operations
const distinctAges = new Queryable(data).select(person => person.age).distinct().getCollection();
const unionResult = new Queryable(data).union([{ id: 6, name: 'David', age: 28 }]).getCollection();
const intersectResult = new Queryable(data).intersect([{ id: 2, name: 'Alice', age: 30 }]).getCollection();
const exceptResult = new Queryable(data).except([{ id: 4, name: 'Sophie', age: 22 }]).getCollection();

console.log(`Distinct Ages: ${JSON.stringify(distinctAges)}`);
console.log(`Union Result: ${JSON.stringify(unionResult)}`);
console.log(`Intersect Result: ${JSON.stringify(intersectResult)}`);
console.log(`Except Result: ${JSON.stringify(exceptResult)}`);

// Example 6: Partitioning and Concatenation
const take2 = new Queryable(data).take(2).getCollection();
const skip2 = new Queryable(data).skip(2).getCollection();
const concatResult = new Queryable(data).concat([{ id: 6, name: 'David', age: 28 }]).getCollection();

console.log(`Take 2: ${JSON.stringify(take2)}`);
console.log(`Skip 2: ${JSON.stringify(skip2)}`);
console.log(`Concat Result: ${JSON.stringify(concatResult)}`);

// Example 7: Conversion
const arrayResult = new Queryable(data).toArray();
const listResult = new Queryable(data).toList();
const dictionaryResult = new Queryable(data).toDictionary(person => person.id);

console.log(`Array Result: ${JSON.stringify(arrayResult)}`);
console.log(`List Result: ${JSON.stringify(listResult)}`);
console.log(`Dictionary Result: ${JSON.stringify([...dictionaryResult])}`);


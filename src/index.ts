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
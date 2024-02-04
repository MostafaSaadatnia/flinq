export declare class Queryable<T> {
    private collection;
    constructor(collection: T[]);
    getCollection(): T[];
    select<U>(selector: (item: T) => U): Queryable<U>;
    where(predicate: (item: T) => boolean): Queryable<T>;
    orderBy(keySelector: (item: T) => any): Queryable<T>;
    groupBy<K>(keySelector: (item: T) => K): Map<K, T[]>;
    join<U, K>(inner: U[], outerKeySelector: (item: T) => K, innerKeySelector: (item: U) => K): Queryable<{
        outer: T;
        inner: U;
    }>;
    count(): number;
    sum(selector: (item: T) => number): number;
    min(selector: (item: T) => any): T | undefined;
    max(selector: (item: T) => any): T | undefined;
    average(selector: (item: T) => number): number;
    any(predicate: (item: T) => boolean): boolean;
    all(predicate: (item: T) => boolean): boolean;
    firstOrDefault(defaultValue?: T): T | undefined;
    lastOrDefault(defaultValue?: T): T | undefined;
    singleOrDefault(defaultValue?: T): T | undefined;
    distinct(): Queryable<T>;
    union(other: T[]): Queryable<T>;
    intersect(other: T[]): Queryable<T>;
    except(other: T[]): Queryable<T>;
    take(count: number): Queryable<T>;
    skip(count: number): Queryable<T>;
    concat(other: T[]): Queryable<T>;
    toArray(): T[];
    toList(): T[];
    toDictionary(keySelector: (item: T) => any): Map<any, T>;
}

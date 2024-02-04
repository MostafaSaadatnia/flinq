declare namespace Flinq {
    class Queryable<T> {
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
}
interface Person {
    id: number;
    name: string;
    age: number;
}
declare const data: Person[];
declare const result1: string[];
declare const count: number;
declare const sumAges: number;
declare const minAge: Person;
declare const maxAge: Person;
declare const averageAge: number;
declare const anyOver30: boolean;
declare const allOver20: boolean;
declare const firstPerson: Person;
declare const lastPerson: Person;
declare const singlePerson: Person;
declare const distinctAges: number[];
declare const unionResult: Person[];
declare const intersectResult: Person[];
declare const exceptResult: Person[];
declare const take2: Person[];
declare const skip2: Person[];
declare const concatResult: Person[];
declare const arrayResult: Person[];
declare const listResult: Person[];
declare const dictionaryResult: Map<any, Person>;

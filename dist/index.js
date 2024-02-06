"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queryable = void 0;
class Queryable {
    constructor(collection) {
        this.collection = collection || [];
    }
    // Method to get the collection
    getCollection() {
        return this.collection;
    }
    // Select operation to project each element of the collection
    select(selector) {
        return new Queryable(this.collection.map(selector));
    }
    // Where operation to filter elements based on a condition
    where(predicate) {
        return new Queryable(this.collection.filter(predicate));
    }
    // OrderBy operation to sort elements
    orderBy(keySelector) {
        return new Queryable([...this.collection].sort((a, b) => {
            const keyA = keySelector(a);
            const keyB = keySelector(b);
            return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
        }));
    }
    // GroupBy operation
    groupBy(keySelector) {
        const groups = new Map();
        this.collection.forEach(item => {
            var _a;
            const key = keySelector(item);
            if (!groups.has(key)) {
                groups.set(key, []);
            }
            (_a = groups.get(key)) === null || _a === void 0 ? void 0 : _a.push(item);
        });
        return groups;
    }
    // Join operation
    join(inner, outerKeySelector, innerKeySelector) {
        const result = [];
        this.collection.forEach(outerItem => {
            const outerKey = outerKeySelector(outerItem);
            const innerMatches = inner.filter(innerItem => innerKeySelector(innerItem) === outerKey);
            innerMatches.forEach(innerItem => {
                result.push({ outer: outerItem, inner: innerItem });
            });
        });
        return new Queryable(result);
    }
    // Aggregation methods
    count() {
        return this.collection.length;
    }
    sum(selector) {
        return this.collection.reduce((acc, curr) => acc + selector(curr), 0);
    }
    min(selector) {
        return this.collection.reduce((min, curr) => {
            const minValue = selector(min);
            const currValue = selector(curr);
            return minValue < currValue ? min : curr;
        }, this.collection[0]);
    }
    max(selector) {
        return this.collection.reduce((max, curr) => {
            const maxValue = selector(max);
            const currValue = selector(curr);
            return maxValue > currValue ? max : curr;
        }, this.collection[0]);
    }
    average(selector) {
        const sum = this.sum(selector);
        return this.count() > 0 ? sum / this.count() : 0;
    }
    // Quantifier methods
    any(predicate) {
        return this.collection.some(predicate);
    }
    all(predicate) {
        return this.collection.every(predicate);
    }
    // Element Operations methods
    firstOrDefault(defaultValue) {
        return this.collection.length > 0 ? this.collection[0] : defaultValue;
    }
    lastOrDefault(defaultValue) {
        return this.collection.length > 0 ? this.collection[this.collection.length - 1] : defaultValue;
    }
    singleOrDefault(defaultValue) {
        return this.collection.length === 1 ? this.collection[0] : defaultValue;
    }
    // Set Operations methods
    distinct() {
        return new Queryable([...new Set(this.collection)]);
    }
    union(other) {
        return new Queryable([...new Set([...this.collection, ...other])]);
    }
    intersect(other) {
        return new Queryable([...new Set(this.collection.filter(item => other.includes(item)))]);
    }
    except(other) {
        return new Queryable([...new Set(this.collection.filter(item => !other.includes(item)))]);
    }
    // Partitioning methods
    // Take operation
    take(count) {
        return new Queryable(this.collection.slice(0, count));
    }
    // Skip operation
    skip(count) {
        return new Queryable(this.collection.slice(count));
    }
    // Concatenation method
    concat(other) {
        return new Queryable([...this.collection, ...other]);
    }
    // Conversion methods
    toArray() {
        return [...this.collection];
    }
    toList() {
        return this.toArray();
    }
    toDictionary(keySelector) {
        const dictionary = new Map();
        this.collection.forEach(item => {
            const key = keySelector(item);
            dictionary.set(key, item);
        });
        return dictionary;
    }
}
exports.Queryable = Queryable;

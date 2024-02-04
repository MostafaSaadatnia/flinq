var Flinq;
(function (Flinq) {
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
    Flinq.Queryable = Queryable;
})(Flinq || (Flinq = {}));
// Example usage:
// Example data
const data = [
    { id: 1, name: 'John', age: 25 },
    { id: 2, name: 'Alice', age: 30 },
    { id: 3, name: 'Bob', age: 22 },
    { id: 4, name: 'Sophie', age: 22 },
    { id: 5, name: 'Sara', age: 29 },
];
// Example 1: Filtering and Projection
const result1 = new Flinq.Queryable(data)
    .where(person => person.age > 22)
    .orderBy(person => person.age)
    .select(person => person.name)
    .getCollection();
console.log(result1);
// Output: ['Bob', 'Sophie', 'Sara']
// Example 2: Aggregation
const count = new Flinq.Queryable(data).count();
const sumAges = new Flinq.Queryable(data).sum(person => person.age);
const minAge = new Flinq.Queryable(data).min(person => person.age);
const maxAge = new Flinq.Queryable(data).max(person => person.age);
const averageAge = new Flinq.Queryable(data).average(person => person.age);
console.log(`Count: ${count}`);
console.log(`Sum of Ages: ${sumAges}`);
console.log(`Min Age: ${minAge === null || minAge === void 0 ? void 0 : minAge.age}`);
console.log(`Max Age: ${maxAge === null || maxAge === void 0 ? void 0 : maxAge.age}`);
console.log(`Average Age: ${averageAge}`);
// Example 3: Quantifiers
const anyOver30 = new Flinq.Queryable(data).any(person => person.age > 30);
const allOver20 = new Flinq.Queryable(data).all(person => person.age > 20);
console.log(`Any person over 30: ${anyOver30}`);
console.log(`All persons over 20: ${allOver20}`);
// Example 4: Element Operations
const firstPerson = new Flinq.Queryable(data).firstOrDefault();
const lastPerson = new Flinq.Queryable(data).lastOrDefault();
const singlePerson = new Flinq.Queryable(data).singleOrDefault({ id: 6, name: 'Mostafa', age: 31 });
console.log(`First Person: ${JSON.stringify(firstPerson)}`);
console.log(`Last Person: ${JSON.stringify(lastPerson)}`);
console.log(`Single Person (Alice): ${JSON.stringify(singlePerson)}`);
// Example 5: Set Operations
const distinctAges = new Flinq.Queryable(data).select(person => person.age).distinct().getCollection();
const unionResult = new Flinq.Queryable(data).union([{ id: 6, name: 'David', age: 28 }]).getCollection();
const intersectResult = new Flinq.Queryable(data).intersect([{ id: 2, name: 'Alice', age: 30 }]).getCollection();
const exceptResult = new Flinq.Queryable(data).except([{ id: 4, name: 'Sophie', age: 22 }]).getCollection();
console.log(`Distinct Ages: ${JSON.stringify(distinctAges)}`);
console.log(`Union Result: ${JSON.stringify(unionResult)}`);
console.log(`Intersect Result: ${JSON.stringify(intersectResult)}`);
console.log(`Except Result: ${JSON.stringify(exceptResult)}`);
// Example 6: Partitioning and Concatenation
const take2 = new Flinq.Queryable(data).take(2).getCollection();
const skip2 = new Flinq.Queryable(data).skip(2).getCollection();
const concatResult = new Flinq.Queryable(data).concat([{ id: 6, name: 'David', age: 28 }]).getCollection();
console.log(`Take 2: ${JSON.stringify(take2)}`);
console.log(`Skip 2: ${JSON.stringify(skip2)}`);
console.log(`Concat Result: ${JSON.stringify(concatResult)}`);
// Example 7: Conversion
const arrayResult = new Flinq.Queryable(data).toArray();
const listResult = new Flinq.Queryable(data).toList();
const dictionaryResult = new Flinq.Queryable(data).toDictionary(person => person.id);
console.log(`Array Result: ${JSON.stringify(arrayResult)}`);
console.log(`List Result: ${JSON.stringify(listResult)}`);
console.log(`Dictionary Result: ${JSON.stringify([...dictionaryResult])}`);

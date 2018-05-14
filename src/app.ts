// explore current configuration

// RXJS Today

const players: any = [{ name: 'Mario', age: 44 }, { name: 'Peach', age: 31 }];

// Functinnal programming, based on lambda & composition
// functional average
const functionnalAverage =
  players
    .map(current => current.age)
    .reduce((acc, current) => (acc += current), 0) / players.length;
console.log('functionnal average', functionnalAverage);

// Declarative programming, based on chain of operators
// declarative average
const pipe = (f, g) => (...args) => g(f(...args));
Array.prototype['pipe'] = function(...fns) {
  return fns.reduce(pipe)(this);
};
import { subArray, average } from './array-operators';
const declarativeAverage = players.pipe(subArray('age'), average);
console.log('declarative average', declarativeAverage);

// Reactive programming, based on observable

// simplest creation operator
// create

// simplest transformation & utilitarian operators
// tap
// map

// explore learn RxJS documentation
// @ https://www.learnrxjs.io/

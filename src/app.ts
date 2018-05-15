// explore current configuration

// RXJS Today
// RxJS: functional & reactive library to deal with stream of events
// using Observable & pipe pattern
// current version: 6.1.0 (angular 6 only), warning: breaking changes 4, 5, 6
// usable anywhere, with anything (node, angular, react, rx only, vue.js)
// Observable propably part of ES10 in 2019, like Promise previously
// @see https://github.com/tc39/proposal-observable
// ReactiveX is everywhere: http://reactivex.io/languages.html

// VOCABULARY

const players: any = [
  { name: 'Mario', age: 44 },
  { name: 'Peach', age: 31 },
  { name: 'Toad', age: 14, banned: true }
];

// linear/imperative average
let ageSum = 0;
let validPlayerNbr = 0;
for (let i = 0; i < players.length; i++) {
  if (!players[i].banned) {
    validPlayerNbr++;
    ageSum += players[i].age;
  }
}
const imperativeAverage = ageSum / validPlayerNbr;
console.log('imperative average', imperativeAverage);

// Functional programming, based on lambda, transformations & composition
// functional average
const filteredPlayers = players.filter(curr => !curr.banned);
const functionnalAverage =
  filteredPlayers
    .map(curr => curr.age)
    .reduce((acc, curr) => (acc += curr), 0) / filteredPlayers.length;
console.log('functionnal average', functionnalAverage);

// Declarative programming, based on chain of operators
// declarative average
Array.prototype['pipe'] = function(...fns) {
  return fns.reduce((acc, fn) => (...args) => fn(acc(...args)))(this);
};

import { without, only, average } from './array-operators';
const declarativeAverage = players.pipe(
  without('banned'),
  only('age'),
  average
);
console.log('declarative average', declarativeAverage);

// Reactive programming, based on observable
function fromArray(arr) {
  return {
    subscribe: observer => {
      arr.forEach(curr => {
        observer.next(curr);
      });
      observer.complete();
    }
  };
}
const obsPlayers = fromArray(players);
obsPlayers.subscribe({
  next: console.log,
  complete: () => console.log('done'),
  error: console.log
});

// CREATION OPERATORS + TAP
// from (iterables)
import { from } from 'rxjs';
from(players).subscribe({
  next: data => console.log(data),
  complete: () => console.log('done'),
  error: console.log
});
// or, as a shortcut for next
from(players).subscribe(data => console.log(data));

// tap: debug and side operations
import { tap } from 'rxjs/operators';
from(players)
  .pipe(tap(console.log))
  .subscribe();

// until subscribtion, no value are emitted

// TRANSFORM & UTILS OPERATORS
// map
import { map } from 'rxjs/operators';
from(players)
  .pipe(
    map((data: any) => {
      return { ...data, age: data.age + ' ans' };
    }),
    tap(console.log)
  )
  .subscribe();

// pluck
import { pluck } from 'rxjs/operators';
from(players)
  .pipe(pluck('name'), tap(console.log))
  .subscribe();

// scan & last & reduce
import { scan, last } from 'rxjs/operators';
from(players)
  .pipe(
    scan((acc, curr: any) => {
      return acc + ' ' + curr.name;
    }, 'Les joueurs en ligne sont:'),
    tap(console.log)
  )
  .subscribe();

// fromEvent (dom events)
import { domService } from './services/dom.service';
from(players)
  .pipe(
    tap((player: any) => {
      document.body.appendChild(domService.createButton(player.name));
      document.body.appendChild(domService.createInput(player.name, 0));
    }),
    last(),
    tap(() => {
      document.body.appendChild(domService.createSpan('total', 'Total:  0'));
    })
  )
  .subscribe();
import { fromEvent } from 'rxjs';
const clickedButton$ = fromEvent(
  document.querySelectorAll('button'),
  'click'
).pipe(
  map((event: any) => document.getElementById(event.target.innerText)),
  tap((el: any) => (el.value = parseInt(el.value, 10) + 1))
);
// clickedButton$.subscribe();

// COMBINATION OPERATORS
// merge
// import { merge } from 'rxjs/operators';
import { merge } from 'rxjs';
const typedInput$ = fromEvent(document.querySelectorAll('input'), 'keyup');
merge(typedInput$, clickedButton$)
  .pipe(
    tap(() => {
      const inputList = document.querySelectorAll('input') as any;
      const total = Array.from(inputList).reduce(
        (acc: any, curr: any) => acc + parseInt(curr.value, 10) || 0,
        0
      );
      document.getElementById('total').innerText = 'total ' + total;
    })
  )
  .subscribe();

// subjects

// cold & hot

// quizz & snake

// NOT THAT MUCH OPERATOR
// CREATE: from/of, fromEvent, fromPromise, interval, timer
// COMBINE: merge, mergeAll, mergeMap,switchMap, forkJoin,
// concat, concatAll, concatMap, combineAll, combineLatest, withLatestFrom
// GET SOME: take, takeUntil, takeWhile, skip, skipUntil, skipWhile
// first, last, single, ignoreElements
// ARRAY LIKE: reduce, map, concat, filter, every
// UTIL: debounce, distinctUntilChanged, pairWise, expand, pluck, scan, delay

// explore learn RxJS documentation
// @see https://www.learnrxjs.io/
// @see http://reactivex.io/rxjs/
// @see marble testing

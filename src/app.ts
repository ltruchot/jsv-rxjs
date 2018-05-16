import { apiService } from './services/api.service';
import { domService } from './services/dom.service';
const samir = domService.createAudio();
document.body.appendChild(samir);
// explore current configuration

/******************************************/
/************* INTRODUCTION ***************/
/******************************************/

// RxJS: functional & reactive library to deal with stream of events
// using Observable & pipe pattern
// It's hard. Don't give up, don't be lazy
// current version: 6.1.0 (angular 6 only), warning: breaking changes 4, 5, 6
// usable anywhere, with anything (node, angular, react, rx only, vue.js)
// Observable propably part of ES10 in 2019, like Promise previously
// @see https://github.com/tc39/proposal-observable
// ReactiveX is everywhere: http://reactivex.io/languages.html
// Most important: rxjs follow the natural evolution of JS programming:
// Declarative & based on streams

/******************************************/
/************** VOCABULARY ****************/
/******************************************/

// Instructions: Provide age average of active players

// linear/imperative/procedural programming
apiService.getAsPromise('http://localhost:4200/api/players').then(players => {
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
});

// Functional programming, based on lambda, transformations & composition
apiService.getAsPromise('http://localhost:4200/api/players').then(players => {
  const filteredPlayers = players.filter(curr => !curr.banned);
  const functionnalAverage =
    filteredPlayers
      .map(curr => curr.age)
      .reduce((acc, curr) => (acc += curr), 0) / filteredPlayers.length;
  console.log('functionnal average', functionnalAverage);
});

// Declarative programming, based on chain of operators
import { without, only, average } from './values/array.operators';
apiService.getAsPromise('http://localhost:4200/api/players').then(players => {
  Array.prototype['pipe'] = function(...fns) {
    return fns.reduce((acc, fn) => (...args) => fn(acc(...args)))(this);
  };
  const declarativeAverage = players.pipe(
    without('banned'),
    only('age'),
    average
  );
  console.log('declarative average', declarativeAverage);
});

// Only for demonstration: an RXJS version

// import { without, only, average, kepass } from './values/rxjs.operators';
// const players$ = apiService.get('http://localhost:4200/api/players');

// players$
//   .pipe(without('banned'), only('age'), average(), kepass())
//   .subscribe(average => console.log('rxjs average', average));

// Observables
// Subscribable collection of future values/events
function fromArray(arr) {
  return {
    subscribe: observer => {
      if (typeof observer === 'function') {
        arr.forEach(curr => {
          observer(curr);
        });
        return;
      }
      try {
        arr.forEach(curr => {
          observer.next(curr);
        });
        observer.complete();
      } catch (e) {
        observer.error(e);
      }
    }
  };
}
const obs123 = fromArray([1, 2, 3]);

// Observer: an object 3 callback: next, complete & error
obs123.subscribe({
  next: console.log,
  complete: () => console.log('done'),
  error: console.log
});

// Observer: or at least a callback (only "next")
obs123.subscribe(console.log);
obs123.subscribe(a => console.log(a * 10));

// COLD: until subscribtion, no value are emitted
// HOT: values are emitted, and everyon subscribe to it

// hot: is already running when you subscribe
// cold: you run it when you subscribe

/******************************************/
/*************** OPERATORS ****************/
/******************************************/

// pure functions that enable a functional programming style
// to create or modify streams

// CREATION OPERATORS + TAP
// from (iterables) & of (object)
import { from, of } from 'rxjs';
const players = [
  { name: 'Mario', age: 44 },
  { name: 'Peach', age: 31 },
  { name: 'Toad', age: 14, banned: true }
];

from(players).subscribe({
  next: console.log,
  complete: () => console.log('done'),
  error: console.log
});

// or as a shortcut
from(players).subscribe(console.log);
of(players).subscribe(console.log);

// tap: debug and side operations
import { tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
from(players)
  .pipe(tap(() => console.log('coucou')), tap(console.log))
  .subscribe();

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
    last(),
    tap(console.log)
  )
  .subscribe();

// fromEvent (dom events)
const form = domService.createForm();
document.body.appendChild(form);
from(players)
  .pipe(
    tap((player: any) => {
      form.appendChild(domService.createButton(player.name));
      form.appendChild(domService.createInput(player.name, 0));
    }),
    last(),
    tap(() => {
      form.appendChild(domService.createSpan('total', 'Total:  0'));
    })
  )
  .subscribe();
import { fromEvent } from 'rxjs';
const clickedButton$ = fromEvent(
  document.querySelectorAll('button'),
  'click'
).pipe(
  debounceTime(500),
  tap((event: any) => {
    event.preventDefault();
    const ipt: any = document.getElementById(event.target.innerText);
    ipt.value = parseInt(ipt.value, 10) + 1;
  })
);
clickedButton$.subscribe();

// COMBINATION OPERATORS
// merge
// import { merge } from 'rxjs/operators';
import { merge } from 'rxjs';
const typedInput$ = fromEvent(document.querySelectorAll('input'), 'keyup');
const mergedEvents = merge(typedInput$, clickedButton$).pipe(
  map(() => {
    const inputList = document.querySelectorAll('input') as any;
    const winner = { name: '', score: 0 };
    const total = Array.from(inputList).reduce((acc: any, curr: any) => {
      const score = parseInt(curr.value, 10);
      if (winner.score < score) {
        winner.score = score;
        winner.name = curr.id;
      }
      return acc + score || 0;
    }, 0);
    document.getElementById('total').innerText = 'total ' + total;
    return winner.name;
  })
);
mergedEvents.subscribe();

// SUBJECTS ?
// When creation operator is insufficient for your problem
// aka: "next" option isn't appropiate
// then, create your own subject !
// it's an observable (subscribe) AND an observer (next/complete/error)
import { Subject } from 'rxjs';
import { kepass } from './values/rxjs.operators';
const winner$ = new Subject();
winner$
  .pipe(
    tap((data: string) => {
      Array.from(document.querySelectorAll('.btn')).forEach(btn =>
        btn.classList.remove('btn-success')
      );
      if (data) {
        const btn = document.getElementById('btn-' + data.toLowerCase());
        btn.classList.add('btn-success');
      }
    }),
    distinctUntilChanged(),
    kepass()
  )
  .subscribe(console.log);
winner$.subscribe();
mergedEvents.pipe(tap(winner => winner$.next(winner))).subscribe();

// Behavior Subject: the same with a first value, like "Peach"
// Replay Subject: the same... but will replay previous values for each subscribers

// HIGHER ORDER OBSERVABLE
// mergeMap, switchMap, concatMap: higher order observable

/*
// quizz & snakeimport { Subject } from 'rxjs';

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
// @see marble testing (official way to do)
*/

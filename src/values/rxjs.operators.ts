import { map, tap } from 'rxjs/operators';

export const kepass = () => obs => {
  return obs.pipe(
    tap(() => {
      (document.getElementById('samir') as HTMLAudioElement).play();
    })
  );
};

export const without = key => obs => {
  return obs.pipe(map((arr: any) => arr.filter(curr => !curr[key])));
};

export const only = key => obs => {
  return obs.pipe(map((arr: any) => arr.map(curr => curr[key])));
};

export const average = () => obs => {
  return obs.pipe(
    map(
      (arr: any) =>
        arr.reduce((acc, current) => (acc += current), 0) / arr.length
    )
  );
};

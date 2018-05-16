export const only = (key: string) => arr => arr.map(curr => curr[key]);

export const average = (arr: number[]) =>
  arr.reduce((acc, current) => (acc += current), 0) / arr.length;

export const without = (key: string) => arr => arr.filter(curr => !curr[key]);

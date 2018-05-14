export const subArray = (subKey: string) => arr =>
  arr.map(curr => curr[subKey]);
export const average = (arr: number[]) =>
  arr.reduce((acc, current) => (acc += current), 0) / arr.length;

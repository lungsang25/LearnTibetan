export const range = (lo: number, hi: number): number[] => {
  const result = Array<number>(hi - lo);
  for (let i = lo; i < hi; i++) {
    result[i - lo] = i;
  }
  return result;
};

export const sum = (numbers: number[]): number => {
  let total = 0;
  for (const number of numbers) {
    total += number;
  }
  return total;
};

export const shuffle = <T>(items: readonly T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j] as T, result[i] as T];
  }
  return result;
};

export const sample = <T>(items: readonly T[], count: number): T[] => {
  return shuffle(items).slice(0, count);
};

export const chunk = <T>(items: readonly T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
};

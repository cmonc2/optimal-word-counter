declare module 'timsort' {
  export function sort<T>(array: T[], compareFn?: (a: T, b: T) => number): void;
}

import { ArrayLength, HeadOfArray, LastOfArray } from "../types/utils";

type FirstArgPipe<F extends Array<(...args: unknown[]) => unknown>> =
  ArrayLength<F> extends 0
    ? <T extends any[]>(...args: T) => HeadOfArray<T>
    : (...args: Parameters<HeadOfArray<F>>) => ReturnType<LastOfArray<F>>

const firstArgPipe = <F extends Array<(...args: unknown[]) => unknown>>(...fns: F): FirstArgPipe<F> => {
  return (...args) => {
    const [initialArg, ...restArgs] = args;
    return fns.reduce((acc, fn) => fn(acc, ...restArgs), initialArg)
  };
}

export default firstArgPipe;
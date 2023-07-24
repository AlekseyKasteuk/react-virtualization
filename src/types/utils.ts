export type UnrequireKeys<T, K extends keyof T> = Omit<T, K> & { [Property in keyof Pick<T, K>]?: T[Property] }

export type ReplaceWithAlternative<S, K extends keyof S, T> =
  Omit<S, K> &
  { [Property in keyof Pick<S, K>]?: S[Property] } &
  Partial<T>
;

export type ArrayLength<List extends unknown[]> = List['length'];
export type HeadOfArray<List extends unknown[]> = List extends readonly [infer F] ? F : undefined;
export type TailOfArray<List extends unknown[]> = List extends readonly [infer F, ...infer T] ? T : [];
export type LastOfArray<List extends ReadonlyArray<unknown>> = List extends readonly [...infer H, infer L] ? L : undefined;
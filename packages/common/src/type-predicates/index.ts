export { default as hasCleanUp } from "./hasCleanUp";
export { default as isRecord } from "./isRecord";
export * from "./isTraitName";

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value !== "";
}

/** Generates a predicate that determines if a value is an array and if the items match a predicate */
export function newIsArrayPredicate<T = any>(
  elementPredicate?: (value: unknown) => value is T
): (array: unknown) => array is T[] {
  return (array: unknown): array is T[] =>
    Array.isArray(array) &&
    (!elementPredicate || array.every(elementPredicate));
}

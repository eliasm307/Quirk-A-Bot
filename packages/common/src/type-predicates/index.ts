export { default as hasCleanUp } from "./hasCleanUp";
export { default as isRecord } from "./isRecord";
export * from "./isTraitName";

/** Predicate for any string */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/** Predicate for any string or undefined */
export function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

/** Predicate for non-empty strings only */
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

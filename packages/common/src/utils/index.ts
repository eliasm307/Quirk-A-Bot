export { default as newId } from "./newId";
export { default as pause } from "./pause";
export { default as valuesAreEqual } from "./valuesAreEqual";
export { default as arrayToRecord } from "./arrayToRecord";
export { default as displayNameToPropertyName } from "./displayNameToPropertyName";
export * from "./arraySorters";

/** Converts a record/object map of values to an array */
export function recordToArray<T>(record: Record<any, T>): T[] {
  return Object.values(record);
}

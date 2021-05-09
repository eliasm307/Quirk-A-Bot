export { default as hasCleanUp } from "./hasCleanUp";
export { default as isRecord } from "./isRecord";
export * from "./isTraitName";

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value !== "";
}

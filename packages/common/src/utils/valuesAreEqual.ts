import { diff } from 'deep-object-diff';

export default function valuesAreEqual(v1: unknown, v2: unknown): boolean {
  if (typeof v1 !== "object" && typeof v2 !== "object") return v1 === v2;

  if (
    /*
    (typeof v1 !== "object" && typeof v2 === "object") ||
    (typeof v1 === "object" && typeof v2 !== "object")
    */
    typeof v1 !== "object" ||
    typeof v2 !== "object"
  ) {
    const error = `Could not check if objects are equal because one or more of the provided arguments is not an object`;
    // console.error(error, { o1, o2 });
    // throw Error(error);
    return false;
  }

  return Object.keys(diff(v1 as any, v2 as any)).length === 0;
}

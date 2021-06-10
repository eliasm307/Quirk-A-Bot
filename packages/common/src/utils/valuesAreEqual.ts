import { diff } from 'deep-object-diff';

export default function valuesAreEqual(v1: unknown, v2: unknown): boolean {
  const bothValuesAreNotObjects =
    typeof v1 !== "object" && typeof v2 !== "object";
  if (bothValuesAreNotObjects) return v1 === v2;

  const oneValueNotAnObject = typeof v1 !== "object" || typeof v2 !== "object";
  if (oneValueNotAnObject) {
    // const error = `Could not check if objects are equal because one of the provided arguments is not an object`;
    // console.error(error, { v1, v2 });
    // throw Error(error);
    return false;
  }

  const objectDifferences = diff(v1 as any, v2 as any);

  const objectsAreIdentical = Object.keys(objectDifferences).length === 0;

  return objectsAreIdentical;
}

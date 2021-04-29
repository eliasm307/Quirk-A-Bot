import { diff } from 'deep-object-diff';

export default function objectsAreEqual(o1: any, o2: any): boolean {
  if (typeof o1 !== "object" || typeof o2 !== "object") {
    const error = `Could not check if objects are equal because one or more of the provided arguments is not an object`;
    console.error(error, { o1, o2 });
    throw Error(error);
  }
  return Object.keys(diff(o1, o2)).length === 0;
}

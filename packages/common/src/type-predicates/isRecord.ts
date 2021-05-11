/** Evaluates if data matches a given record key value schema */
export default function isRecord<K extends string | number, V>(
  data: unknown,
  keyPredicate: (key: unknown) => key is K,
  valuePredicate: (value: unknown) => value is V
): data is Record<K, V> {
  if (typeof data !== "object") return false;
  if (!data) return false;

  for (const [key, value] of Object.entries(data)) {
    // check schema of each key value pair
    if (!keyPredicate(key)) {
      console.warn(__filename, `key "${key}" does not meet predicate`);
      return false;
    }
    if (!valuePredicate(value)) {
      console.warn(
        __filename,
        `value for key "${key}" does not meet predicate`,
        { key, value }
      );
      return false;
    }
  }

  return true;
}

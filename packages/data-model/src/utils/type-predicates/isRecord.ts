/** Evaluates if data matches a given record key value schema */
export default function isRecord<K extends string | number, V>(
  data: unknown,
  keyPredicate: (key: any) => key is K,
  valuePredicate: (value: any) => value is V
): data is Record<K, V> {
  if (typeof data !== "object") return false;
  if (!data) return false;

  for (const [key, _value] of Object.entries(data)) {
    // check schema of each key value pair
    if (!keyPredicate(key)) {
      return false;
    }
  }

  return true;
}

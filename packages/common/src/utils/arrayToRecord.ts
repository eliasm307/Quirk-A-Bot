interface Props<V, K extends string | number> {
  array: V[];
  propertyNameReducer: (element: V) => K;
}

export default function arrayToRecord<V, K extends string | number = string>(
  props: Props<V, K>
): Record<K, V> {
  const { array, propertyNameReducer } = props;

  const result: Record<K, V> = {} as Record<K, V>;

  // map array values to computed keys
  array.forEach((element) => {
    const key = propertyNameReducer(element);
    result[key] = element;
  });

  return { ...result };
}

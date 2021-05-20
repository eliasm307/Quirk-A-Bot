export type ChangeHandler<D> = (newData?: D) => void;

export type SchemaPredicateMap<S extends Record<string, any>> = {
  [K in keyof S]: (value: unknown) => value is S[K];
};

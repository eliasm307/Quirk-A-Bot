export interface iDocumentGroup<K extends string, V> {
  readonly data?: GenericObject<K, V>;

  get(key: K): iSubDocument<V> | undefined;
  toArray(): iSubDocument<V>[];
}
export interface iSubDocument<V> {
  readonly parentDocumentPath: string;

  data: V;

  delete(): void;
  setDataLocallyOnly(newValue: V): void;
}

// todo move tomore general location
export type GenericObject<K extends string, V> = {
  [key in K]: V;
};

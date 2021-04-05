// todo move tomore general location
export type GenericObject<K extends string, V> = {
  [key in K]: V;
};

export interface iSubDocument<V> {
  readonly parentDocumentPath: string;

  data: V;

  delete(): void;
  setDataLocallyOnly(newValue: V): void;
}

export interface iDocumentGroup<K extends string, V> {
  readonly data?: GenericObject<K, V>;

  cleanUp(): void;
  get(key: K): iSubDocument<V> | undefined;
  toArray(): iSubDocument<V>[];
}

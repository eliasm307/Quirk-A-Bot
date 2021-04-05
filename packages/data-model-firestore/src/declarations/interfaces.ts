export interface iDocumentGroup<K extends string, V> {
  get(key: K): iSubDocument<V> | undefined;
  toArray(): iSubDocument<V>[];
}
export interface iSubDocument<V> {
  data: V;
  parentDocumentPath: string;

  delete(): void;
  setLocalData(newValue: V): void;
}
export type GenericObject<K extends string, V> = {
  [key in K]: V;
};

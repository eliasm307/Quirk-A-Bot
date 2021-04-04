export interface iDocumentGroup<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): iDocumentGroup<K, V>;
}
export type GenericObject<K extends string, V> = {
  [key in K]: V;
};

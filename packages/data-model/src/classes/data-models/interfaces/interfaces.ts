import { Observable } from "rxjs";

// ! this simplicity allows the implementation of models in different data storages to be more flexible e.g. the structure of local file based storage and Firestore by document is quite different and has very little overlaps which cause issues if you try to make one size fits all granular interfaces
/**
 * Simplified model that only accepts updates and provides change notifications
 */
export interface BaseModel<T> {
  readonly changes: Observable<T>;

  dispose(): void;
  update(updates: Partial<Omit<T, "id">>): void;
}

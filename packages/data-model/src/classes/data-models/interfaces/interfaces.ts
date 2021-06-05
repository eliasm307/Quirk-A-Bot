import { Observable } from "rxjs";

export interface BaseModel<T> {
  readonly changes: Observable<T>;

  update(updates: Partial<Omit<T, "id">>): void;
}

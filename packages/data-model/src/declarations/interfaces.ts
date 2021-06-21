import { ChangeHandler, Firestore } from '@quirk-a-bot/common';

// todo move this to common

export interface iHasGetData<D> {
  readonly data: () => D;
}

export interface iBaseEntity<D>
  extends Readonly<iHasId>,
    Readonly<iHasPath>,
    iHasCleanUp {
  // todo controllers and data stores should implement this
  data(): Promise<D>;
  /** Registers a callback to call when game data changes */
  onChange(handler: ChangeHandler<D>): void;
  update(updates: Partial<Omit<D, "id" | "uid">>): Promise<void>;
}

// todo use where relevant
export interface iBaseViewModelOLD<D> extends iBaseEntity<D> {}

// todo use where relevant
export interface iBaseModel<D> extends iBaseEntity<D> {}

export interface iHasInitialData<D> {
  initialData: D;
}

export interface iHasId {
  id: string;
}
export interface iCanHaveId {
  id?: string;
}
export interface iHasResolvedBasePath {
  resolvedBasePath: string;
}

export interface iHasFirestore {
  firestore: Firestore;
}

export interface iCanHaveGetData<D> {
  data?: () => D;
}

export interface iCanHaveSaveAction {
  saveAction?: () => boolean;
}

export interface iCanDescribe {
  describe(): string;
}

export interface iHasSaveAction {
  saveAction: () => boolean;
}

export interface iBaseCollection<
  K extends string,
  SetValueType,
  ReturnValueType,
  CollectionType
> {
  readonly size: number;

  delete(key: K): CollectionType | Promise<CollectionType>;
  get(key: K): ReturnValueType | void;
  has(key: K): boolean;
  /**
   * Update trait value if it exists, otherwise add a new one
   * @param name name of trait to edit or create
   * @param newValue value to assign
   */
  set(key: K, value: SetValueType): CollectionType | Promise<CollectionType>;
  toArray(): ReturnValueType[];
}

// ? should this be renamed to parentId?
export interface iHasParentPath {
  /** Path from the root to reach the parent of this item */
  parentPath: string;
}

export interface iCanHaveParentPath {
  /** Path from the root to reach the parent of this item */
  parentPath?: string;
}

// ? should this be renamed to id?
export interface iHasPath {
  /** Path from the root to reach this item */
  path: string;
}

export interface iHasCleanUp {
  cleanUp(): boolean;
}

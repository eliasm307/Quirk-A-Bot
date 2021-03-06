import { iDataStorageFactory } from './data-storage-interfaces';
export interface iToJson<T> {
	toJson: () => T;
}
export interface iCanHaveSaveAction {
	saveAction?: () => boolean;
}



export interface iHasDataStorageFactory {
	dataStorageFactory: iDataStorageFactory
}

export interface iHasSaveAction {
	saveAction: () => boolean;
}
export interface iHasOldValue<T> {
	oldValue: T;
}

export interface iHasNewValue<T> {
	newValue: T;
}

export interface iBaseCollection<K extends string, V  >  {
	// todo this should extend a base iCollection
	get(key: K): V | void;
	delete(key: K): void;
	has(key: K): boolean;
	toArray(): V[];
	readonly size: number;
}
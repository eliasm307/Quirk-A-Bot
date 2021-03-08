import { iDataStorageFactory } from './data-storage-interfaces';
export interface iToJson<D> {
	toJson: () => D;
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
export interface iHasOldValue<V> {
	oldValue: V;
}

export interface iHasNewValue<V> {
	newValue: V;
}

export interface iBaseCollection<K extends string, SetValue, ReturnValue, C> {
	// todo this should extend a base iCollection
	get(key: K): ReturnValue | void;
	set(key: K, value: SetValue): C;
	delete(key: K): C;
	has(key: K): boolean;
	toArray(): ReturnValue[];
	readonly size: number;
}
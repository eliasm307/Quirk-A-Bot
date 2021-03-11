import { TraitTypeNameUnion } from './../types';
import { iCharacterSheetDataStorage, iDataStorageFactory } from './data-storage-interfaces';
export interface iHasToJson<D> {
	toJson: () => D;
}

export interface iCanHaveToJson<D> {
	toJson?: () => D;
}

export interface iCanHaveSaveAction {
	saveAction?: () => boolean;
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

export interface iBaseCollection<K extends string, SetValueType, ReturnValueType, CollectionType> {
	// todo this should extend a base iCollection
	get(key: K): ReturnValueType | void;

	/**
	 * Update trait value if it exists, otherwise add a new one
	 * @param name name of trait to edit or create
	 * @param newValue value to assign
	 */
	set(key: K, value: SetValueType): CollectionType;
	delete(key: K): CollectionType;
	has(key: K): boolean;
	toArray(): ReturnValueType[];
	readonly size: number;
}

// ? should this be renamed to id?
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

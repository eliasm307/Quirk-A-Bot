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

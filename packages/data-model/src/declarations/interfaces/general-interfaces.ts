export interface iToJson<T> {
	toJson: () => T;
}
export interface iSaveAction {
	saveAction?: () => boolean;
}
export interface iOldValue<T> {
	oldValue: T;
}

export interface iNewValue<T> {
	newValue: T; // delete doesnt require this
}

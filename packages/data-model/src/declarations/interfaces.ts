export interface iHasGetData<D> {
	readonly data: () => D;
}

export interface iCanHaveGetData<D> {
	data?: () => D;
}

export interface iCanHaveSaveAction {
	saveAction?: () => boolean;
}

export interface iCanDescribe {
	describe: () => string;
}

export interface iHasSaveAction {
	saveAction: () => boolean;
}

export interface iBaseCollection<K extends string, SetValueType, ReturnValueType, CollectionType> {
	readonly size: number;

	delete(key: K): CollectionType;
	get(key: K): ReturnValueType | void;
	has(key: K): boolean;
	/**
	 * Update trait value if it exists, otherwise add a new one
	 * @param name name of trait to edit or create
	 * @param newValue value to assign
	 */
	set(key: K, value: SetValueType): CollectionType;
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

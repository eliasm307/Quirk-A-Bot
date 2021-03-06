import { iCharacterSheetData } from './character-sheet-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from './../types';
import { iGeneralTrait, iGeneralTraitData, iTraitData } from './trait-interfaces';
import { iCanHaveSaveAction } from './general-interfaces';

export interface iTraitDataStorageProps<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion> {
	name: N;
	value?: V; // NOTE initial value required for local storage as values are kept in memory
	defaultValue: V
}

/** The base data storage object instance shape */
export interface iBaseDataStorage {
	save(): boolean;
}

export interface iTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends iBaseDataStorage,
		iTraitData<N, V> {}

export interface iTraitCollectionDataStorage<N extends TraitNameUnionOrString, D extends iGeneralTraitData>
	extends iBaseDataStorage {
	// todo this should extend a base iCollection
	get(name: N): D | void;
	delete(name: N): void;
	has(name: N): boolean;
	toArray(): D[];
	readonly size: number;
}

export interface iCharacterSheetDataStorage extends iBaseDataStorage {
	get(): iCharacterSheetData;
}

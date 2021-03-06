import { iBaseCollection } from './general-interfaces';
import { iCharacterSheet, iCharacterSheetData } from './character-sheet-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from './../types';
import { iGeneralTraitData, iTraitData } from './trait-interfaces';

// -------------------------------------------------------
// GENERAL

export interface iHasTraitDataStorageInitialiser<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion> {
	traitDataStorageInitialiser: (props: iBaseTraitDataStorageProps<N, V>) => iTraitDataStorage<N, V>;
}

// -------------------------------------------------------
// PROPS

export interface iBaseTraitDataStorageProps<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion> {
	name: N;
	defaultValueIfNotDefined: V;
}

export interface iInMemoryTraitDataStorageProps<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends iBaseTraitDataStorageProps<N, V> {}

export interface iLocalTraitDataStorageProps<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends iBaseTraitDataStorageProps<N, V> {
	characterSheet: iCharacterSheet;
}

// -------------------------------------------------------
// DATA STORAGE OBJECTS

/** The base data storage object instance shape */
export interface iBaseDataStorage {
	save(): boolean;
}

export interface iTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends iBaseDataStorage,
		iTraitData<N, V> {}

export interface iTraitCollectionDataStorage<N extends TraitNameUnionOrString, D extends iGeneralTraitData>
	extends iBaseDataStorage,
		iBaseCollection<N, D, D> {}

export interface iCharacterSheetDataStorage extends iBaseDataStorage {
	get(): iCharacterSheetData;
}

// -------------------------------------------------------
// DATA STORAGE FACTORY

export interface iDataStorageFactory {
	// ? do data storage objects need to use N V generics? user wont interact with these directly

	newTraitDataStorageInitialiser<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>(): (
		props: iBaseTraitDataStorageProps<N, V>
	) => iTraitDataStorage<N, V>;
}

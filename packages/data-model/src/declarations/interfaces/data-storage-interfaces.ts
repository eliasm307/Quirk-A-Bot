import { iBaseCollection, iToJson } from './general-interfaces';
import { iCharacterSheet, iCharacterSheetData } from './character-sheet-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from './../types';
import { iBaseTrait, iGeneralTraitData, iHasTraitInstanceCreator, iTraitData } from './trait-interfaces';
import { iLoggerCollection } from './log-interfaces';

// -------------------------------------------------------
// GENERAL

export interface iHasTraitDataStorageInitialiser<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion> {
	traitDataStorageInitialiser: (props: iBaseTraitDataStorageProps<N, V>) => iTraitDataStorage<N, V>;
}

// -------------------------------------------------------
// TRAIT DATA STORAGE PROPS

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
// TRAIT COLLECTION DATA STORAGE PROPS
export interface iBaseTraitCollectionDataStorageProps<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends iHasTraitInstanceCreator<N, V, D, T>,
		iHasTraitDataStorageInitialiser<N, V> {
	name: string;
}

export interface iLocalFileTraitCollectionDataStorageProps<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends iBaseTraitCollectionDataStorageProps<N, V, D, T> {
	characterSheet: iCharacterSheet;
}

// -------------------------------------------------------
// DATA STORAGE OBJECTS

/** The base data storage object instance shape */
export interface iBaseDataStorage {
	// save(): boolean;
}

export interface iTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends iBaseDataStorage,
		iTraitData<N, V> {}

export interface iTraitCollectionDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends iBaseDataStorage,
		iBaseCollection<N, V, T>,
		iToJson<D[]>,
		iLoggerCollection {
	name: string;
}

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

	newTraitCollectionDataStorageInitialiser<
		N extends TraitNameUnionOrString,
		V extends TraitValueTypeUnion,
		D extends iTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(): (props: iBaseTraitCollectionDataStorageProps<N, V, D, T>) => iTraitCollectionDataStorage<N, V, D, T>;
}

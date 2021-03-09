import { Firestore } from './../../utils/firebase';
import { iBaseCollection, iHasToJson, iHasDataStorageFactory, iHasParentPath, iHasPath } from './general-interfaces';
import { iCharacterSheet, iCharacterSheetData, iBaseCharacterSheet } from './character-sheet-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from './../types';
import {
	iBaseTrait,
	iGeneralTraitData,
	iHasTraitInstanceCreator,
	iBaseTraitData,
	iBaseTraitShape,
} from './trait-interfaces';
import { iLoggerCollection, iAddLogEvent, iAddLogEventProps, iDeleteLogEventProps } from './log-interfaces';

// -------------------------------------------------------
// GENERAL

export interface iHasCharacterSheet {
	characterSheet: iCharacterSheet;
}
export interface iHasCharacterSheetData {
	characterSheetData: iCharacterSheetData;
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

// -------------------------------------------------------
// DATA STORAGE FACTORY PROPS
// Note the props should be for initialising the data storage

export interface iBaseDataStorageFactoryProps {}

export interface iInMemoryFileDataStorageFactoryProps {}

export interface iLocalFileDataStorageFactoryProps extends iHasResolvedBasePath {}

export interface iFirestoreDataStorageFactoryProps extends iHasFirestore {}

// -------------------------------------------------------
// DATA STORAGE INSTANTIATOR PROPS
// Note the props should be the minimal required to instantiate the required object, they should be consistent for all factory classes as these are what the client will interact with

// todo implement these for instantiator props

export interface iCharacterSheetDataStorageInstantiatorProps extends iHasId {}
export interface iTraitDataStorageInitialiserProps extends iHasCharacterSheet {}
export interface iTraitCollectionDataStorageInitialiserProps extends iHasCharacterSheet {}

// -------------------------------------------------------
// TRAIT DATA STORAGE PROPS

export interface iBaseTraitDataStorageProps<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends iHasPath {
	name: N;
	defaultValueIfNotDefined: V;
}

export interface iInMemoryTraitDataStorageProps<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends iBaseTraitDataStorageProps<N, V> {}

export interface iLocalFileTraitDataStorageProps<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends iBaseTraitDataStorageProps<N, V>,
		iHasCharacterSheet,
		iHasResolvedBasePath {}

export interface iFirestoreTraitDataStorageProps<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends iBaseTraitDataStorageProps<N, V>,
		iHasCharacterSheet,
		iHasFirestore,
		iHasPath {}

// -------------------------------------------------------
// TRAIT COLLECTION DATA STORAGE PROPS
export interface iBaseTraitCollectionDataStorageProps<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends iHasTraitInstanceCreator<N, V, D, T>,
		iHasTraitDataStorageInitialiser,
		iHasParentPath {
	initialData?: D[];
	name: string;
	onAdd: (props: iAddLogEventProps<V>) => void;
	onDelete: (props: iDeleteLogEventProps<V>) => void;
}

export interface iLocalFileTraitCollectionDataStorageProps<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends iBaseTraitCollectionDataStorageProps<N, V, D, T>,
		iHasResolvedBasePath {
	characterSheet: iCharacterSheet;
}

export interface iFirestoreTraitCollectionDataStorageProps<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends iBaseTraitCollectionDataStorageProps<N, V, D, T>,
		iHasResolvedBasePath,
		iHasFirestore {
	characterSheet: iCharacterSheet;
}

export interface iBaseCharacterSheetDataStorageProps extends iHasId, iHasDataStorageFactory {}

export interface iLocalFileCharacterSheetDataStorageProps
	extends iBaseCharacterSheetDataStorageProps,
		iHasResolvedBasePath {}

export interface iFirestoreCharacterSheetDataStorageProps extends iBaseCharacterSheetDataStorageProps, iHasFirestore {}

// -------------------------------------------------------
// DATA STORAGE OBJECTS

export interface iTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends iBaseTraitData<N, V> {}

export interface iTraitCollectionDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends iBaseCollection<N, V, T, iTraitCollectionDataStorage<N, V, D, T>>,
		iHasToJson<D[]>,
		iLoggerCollection,
		iHasPath {
	name: string;
}

/** Represents character sheet data in a data store */
export interface iCharacterSheetDataStorage {
	/** Returns the character sheet data from the data storage */
	getData(): iCharacterSheetData;

	/** Tests if a character sheet with the given id actually exists in the given data storage */
	exists(): boolean;

	/** Creates new character sheet data for the given id, with default values */
	initialise(): boolean;
}

// -------------------------------------------------------
// DATA STORAGE FACTORY

export interface iDataStorageFactory {
	// ? do data storage objects need to use N V generics? user wont interact with these directly

	newTraitDataStorageInitialiser(
		props: iTraitDataStorageInitialiserProps
	): <N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iTraitDataStorage<N, V>;

	newTraitCollectionDataStorageInitialiser(
		props: iTraitCollectionDataStorageInitialiserProps
	): <
		N extends TraitNameUnionOrString,
		V extends TraitValueTypeUnion,
		D extends iBaseTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(
		props: iBaseTraitCollectionDataStorageProps<N, V, D, T>
	) => iTraitCollectionDataStorage<N, V, D, T>;
	/*
	newTraitCollectionDataStorage<
		N extends TraitNameUnionOrString,
		V extends TraitValueTypeUnion,
		D extends iTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(
		props: iBaseTraitCollectionDataStorageProps<N, V, D, T>
	): iTraitCollectionDataStorage<N, V, D, T>;
	*/

	newCharacterSheetDataStorage(props: iCharacterSheetDataStorageInstantiatorProps): iCharacterSheetDataStorage;
}

// -------------------------------------------------------
// INITIALISERS

export interface iHasTraitDataStorageInitialiser {
	traitDataStorageInitialiser<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	): iTraitDataStorage<N, V>;
}

export interface iHasTraitCollectionDataStorageInitialiser {
	traitCollectionDataStorageInitialiser<
		N extends TraitNameUnionOrString,
		V extends TraitValueTypeUnion,
		D extends iBaseTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(
		props: iBaseTraitCollectionDataStorageProps<N, V, D, T>
	): iTraitCollectionDataStorage<N, V, D, T>;
}

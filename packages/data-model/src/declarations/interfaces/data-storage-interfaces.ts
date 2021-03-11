import { Firestore } from '../../utils/firebase';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../types';
import { iCharacterSheet, iCharacterSheetData, iHasCharacterSheet } from './character-sheet-interfaces';
import { iBaseCollection, iHasParentPath, iHasPath, iHasToJson } from './general-interfaces';
import {
	iAddLogEventProps,
	iCharacterSheetLogger,
	iDeleteLogEventProps,
	iHasTraitCollectionLogReporter,
	iHasTraitLogReporter,
	iTraitCollectionLogger,
	iTraitLogger,
} from './log-interfaces';
import { iBaseTrait, iBaseTraitData, iCanHaveLoggerCreator, iHasTraitInstanceCreator } from './trait-interfaces';

// todo split this up

// -------------------------------------------------------
// GENERAL

export interface iHasDataStorageFactory {
	dataStorageFactory: iDataStorageFactory;
}

export interface iHasCharacterSheetDataStorage {
	characterSheetDataStorage: iCharacterSheetDataStorage;
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

export interface iBaseDataStorageFactoryProps {
	// logger: iCharacterSheetLogger | null;
}

export interface iInMemoryFileDataStorageFactoryProps extends iBaseDataStorageFactoryProps {}

export interface iLocalFileDataStorageFactoryProps extends iBaseDataStorageFactoryProps, iHasResolvedBasePath {}

export interface iFirestoreDataStorageFactoryProps extends iBaseDataStorageFactoryProps, iHasFirestore {}

// -------------------------------------------------------
// DATA STORAGE INSTANTIATOR PROPS
// Note the props should be the minimal required to instantiate the required object, they should be consistent for all factory classes as these are what the client will interact with

// todo implement these for instantiator props

export interface iCharacterSheetDataStorageFactoryProps extends iHasId, iHasParentPath {}
export interface iTraitDataStorageInitialiserFactoryProps extends iHasCharacterSheet {}
export interface iTraitCollectionDataStorageInitialiserFactoryProps extends iHasCharacterSheet {}

export interface iBaseCharacterSheetDataStorageFactoryMethodProps extends iHasId, iHasParentPath {}

// -------------------------------------------------------
// TRAIT DATA STORAGE PROPS

export interface iBaseTraitDataStorageProps<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends iHasParentPath,
		iCanHaveLoggerCreator<iTraitLogger> {
	defaultValueIfNotDefined: V;
	name: N;
}

export interface iInMemoryTraitDataStorageProps<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends iBaseTraitDataStorageProps<N, V> {}

export interface iLocalFileTraitDataStorageProps<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends iBaseTraitDataStorageProps<N, V>,
		iHasCharacterSheet,
		iHasResolvedBasePath {}

export interface iFirestoreTraitDataStorageProps<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends iBaseTraitDataStorageProps<N, V>,
		iHasFirestore,
		iHasParentPath {}

// -------------------------------------------------------
// TRAIT COLLECTION DATA STORAGE PROPS
export interface iBaseTraitCollectionDataStorageProps<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends iHasTraitInstanceCreator<N, V, D, T>,
		iHasTraitDataStorageInitialiser,
		iHasParentPath,
		iCanHaveLoggerCreator<iTraitCollectionLogger> {
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
		iHasFirestore {}

export interface iBaseCharacterSheetDataStorageProps extends iHasId, iHasParentPath, iHasDataStorageFactory {}

export interface iLocalFileCharacterSheetDataStorageProps
	extends iBaseCharacterSheetDataStorageProps,
		iHasResolvedBasePath {}

export interface iFirestoreCharacterSheetDataStorageProps extends iBaseCharacterSheetDataStorageProps, iHasFirestore {}

// -------------------------------------------------------
// DATA STORAGE OBJECTS

export interface iBaseTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends iBaseTraitData<N, V>,
		iHasPath,
		iHasTraitLogReporter {}

export interface iTraitCollectionDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends iBaseCollection<N, V, T, iTraitCollectionDataStorage<N, V, D, T>>,
		iHasToJson<D[]>,
		iHasTraitCollectionLogReporter,
		iHasPath {
	name: string;
}

/** Represents character sheet data in a data store */
export interface iCharacterSheetDataStorage extends iHasPath {
	/** Makes sure that a character sheet with the given id actually exists in the given data storage, otherwise it creates it with default values */
	assertDataExistsOnDataStorage(): Promise<void>;
	/** Returns the character sheet data from the data storage */
	getData(): iCharacterSheetData;

	/** Tests if a character sheet with the given id actually exists in the given data storage */
	// exists(): Promise<boolean>;

	/** Creates new character sheet data for the given id, with default values */
	// initialise(): Promise<boolean>;
}

// -------------------------------------------------------
// DATA STORAGE FACTORY

export interface iDataStorageFactory {
	newCharacterSheetDataStorage(props: iCharacterSheetDataStorageFactoryProps): iCharacterSheetDataStorage;
	newTraitCollectionDataStorageInitialiser(
		props: iTraitCollectionDataStorageInitialiserFactoryProps
	): <
		N extends TraitNameUnionOrString,
		V extends TraitValueTypeUnion,
		D extends iBaseTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(
		props: iBaseTraitCollectionDataStorageProps<N, V, D, T>
	) => iTraitCollectionDataStorage<N, V, D, T>;
	// NOTE the factory props just define what will be available, the specific factories dont need to require any of the given props
	newTraitDataStorageInitialiser(
		props: iTraitDataStorageInitialiserFactoryProps
	): <N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iBaseTraitDataStorage<N, V>;
}

// -------------------------------------------------------
// INITIALISERS

export interface iHasTraitDataStorageInitialiser {
	traitDataStorageInitialiser<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	): iBaseTraitDataStorage<N, V>;
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

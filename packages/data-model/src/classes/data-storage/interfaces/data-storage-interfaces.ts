/* eslint-disable no-use-before-define */
import { UID } from '@quirk-a-bot/common';

import {
  iBaseCollection, iHasCleanUp, iHasGetData, iHasPath,
} from '../../../declarations/interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import {
  iCharacterSheet, iCharacterSheetData,
} from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { iGameCharacterData } from '../../game/interfaces/game-player-interfaces';
import {
  iHasTraitCollectionLogReporter, iHasTraitLogReporter,
} from '../../log/interfaces/log-interfaces';
import { iBaseTrait, iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import {
  iCharacterSheetDataStorageFactoryProps, iGameDataStorageFactoryProps,
  iTraitCollectionDataStorageInitialiserFactoryProps, iTraitDataStorageInitialiserFactoryProps,
} from './props/data-storage-creator';
import { iBaseTraitCollectionDataStorageProps } from './props/trait-collection-data-storage';
import { iBaseTraitDataStorageProps } from './props/trait-data-storage';

// todo split this up

// -------------------------------------------------------
// GENERAL

export interface iHasDataStorageFactory {
  dataStorageFactory: iDataStorageFactory;
}

export interface iHasCharacterSheetDataStorage {
  characterSheetDataStorage: iCharacterSheetDataStorage;
}

// -------------------------------------------------------
// DATA STORAGE OBJECTS

export interface iBaseTraitDataStorage<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion
> extends iBaseTrait<N, V>,
    iHasPath,
    iHasTraitLogReporter,
    iHasCleanUp {}

export interface iTraitCollectionDataStorage<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion,
  D extends iBaseTraitData<N, V>,
  T extends iBaseTrait<N, V, D>
> extends iBaseCollection<N, V, T, iTraitCollectionDataStorage<N, V, D, T>>,
    iHasGetData<D[]>,
    iHasTraitCollectionLogReporter,
    iHasPath,
    iHasCleanUp {
  name: string;
}

/** Represents character sheet data in a data store */
export interface iCharacterSheetDataStorage extends iHasPath {
  /** Makes sure that a character sheet with the given id actually exists in the given data storage, otherwise it creates it with default values */
  assertDataExistsOnDataStorage(): Promise<void>;
  /** Returns the character sheet data from the data storage */
  getData(): iCharacterSheetData;
}

/** Represents all game data in a data store, access control to be handled by proxies */
export interface iGameDataStorage extends iHasPath {
  readonly description: string;

  /** If a character doesn't already exist, this sets-up a character with default details */
  addCharacter(id: string): Promise<void>;
  /** Makes sure that a game with the given id actually exists in the given data storage, otherwise it creates it with default values */
  assertDataExistsOnDataStorage(): Promise<void>;
  /** Returns instantiated character sheet objects for the game */
  getCharacterSheets(): Promise<iCharacterSheet[]>;
  getCharacters(): Promise<iGameCharacterData[]>;
  /** Returns the game data */
  getData(): Promise<iGameData>;
  setDescription(description: string): Promise<void>;
}

// -------------------------------------------------------
// DATA STORAGE FACTORY

export interface iDataStorageFactory {
  /** Validates an id, throws an error if not valid */
  assertIdIsValid(id: string): void;
  /** Validates an id and returns a boolean to indicate validity */
  idIsValid(id: string): boolean;
  newCharacterSheetDataStorage(
    props: iCharacterSheetDataStorageFactoryProps
  ): iCharacterSheetDataStorage;
  /** // todo instantiation method should be async */
  newGameDataStorage(props: iGameDataStorageFactoryProps): iGameDataStorage;
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

// NOTE the factory props just define what will be available, the specific factories don't need to require any of the given props
  // ! traits will always be part of trait collections, so factory shouldn't have this method. Trait collections should instead
  /*
  newTraitDataStorageInitialiser(
    props: iTraitDataStorageInitialiserFactoryProps
  ): <N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>(
    props: iBaseTraitDataStorageProps<N, V>
  ) => iBaseTraitDataStorage<N, V>;
  */
}

// todo move to standalone file?
// -------------------------------------------------------
// INITIALISERS

export interface iHasTraitDataStorageInitialiser<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion
> {
  traitDataStorageInitialiser(
    props: iBaseTraitDataStorageProps<N, V>
  ): iBaseTraitDataStorage<N, V>;
}

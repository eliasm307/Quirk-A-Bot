// -------------------------------------------------------
// DATA STORAGE INSTANTIATOR PROPS
// Note the props should be the minimal required to instantiate the required object, they should be consistent for all factory classes as these are what the client will interact with

import { iHasParentPath } from 'src/declarations/interfaces';

import { iHasCharacterSheet } from '../../../character-sheet/interfaces/character-sheet-interfaces';
import { iHasId } from '../data-storage-interfaces';

// todo implement these for instantiator props

export interface iCharacterSheetDataStorageFactoryProps
  extends iHasId,
    iHasParentPath {}
// ? really similar to iCharacterSheetDataStorageFactoryProps, should they be the same?
export interface iGameDataStorageFactoryProps extends iHasId, iHasParentPath {}
export interface iTraitDataStorageInitialiserFactoryProps
  extends iHasCharacterSheet {}
export interface iTraitCollectionDataStorageInitialiserFactoryProps
  extends iHasCharacterSheet {}

export interface iBaseCharacterSheetDataStorageFactoryMethodProps
  extends iHasId,
    iHasParentPath {}

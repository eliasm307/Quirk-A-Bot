import { iHasParentPath } from '@quirk-a-bot/common';

import { iHasFirestore, iHasId } from '../../../../declarations/interfaces';
import { iHasDataStorageFactory } from '../data-storage-interfaces';

// ? really similar to iCharacterSheetDataStorageFactoryProps, should they be the same?
export interface iGameDataStorageFactoryProps extends iHasId, iHasParentPath {}

export interface iBaseGameDataStorageProps
  extends iHasId,
    iHasParentPath,
    iHasDataStorageFactory {}

export interface iFirestoreGameDataStorageProps
  extends iBaseGameDataStorageProps,
    iHasFirestore {}

export interface iFirestoreCompositeGameDataStorageProps
  extends iBaseGameDataStorageProps,
    iHasFirestore {}

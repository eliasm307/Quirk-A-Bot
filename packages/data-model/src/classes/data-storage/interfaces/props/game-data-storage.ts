import { iHasParentPath } from '@quirk-a-bot/common';

import { iHasFirestore, iHasId } from '../../../../declarations/interfaces';
import { iHasDataStorageFactory } from '../data-storage-interfaces';

export interface iBaseGameDataStorageProps
  extends iHasId,
    iHasParentPath,
    iHasDataStorageFactory {}

export interface iFirestoreCharacterSheetDataStorageProps
  extends iBaseGameDataStorageProps,
    iHasFirestore {}

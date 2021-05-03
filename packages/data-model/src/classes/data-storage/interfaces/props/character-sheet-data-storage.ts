import { iHasParentPath } from '@quirk-a-bot/common';

import { iHasFirestore, iHasId, iHasResolvedBasePath } from '../../../../declarations/interfaces';
import { iHasDataStorageFactory } from '../data-storage-interfaces';

export interface iBaseCharacterSheetDataStorageProps
  extends iHasId,
    iHasParentPath,
    iHasDataStorageFactory {}

export interface iLocalFileCharacterSheetDataStorageProps
  extends iBaseCharacterSheetDataStorageProps,
    iHasResolvedBasePath {}

export interface iFirestoreCharacterSheetDataStorageProps
  extends iBaseCharacterSheetDataStorageProps,
    iHasFirestore {}

export interface iFirestoreCompositeCharacterSheetDataStorageProps
  extends iBaseCharacterSheetDataStorageProps,
    iHasFirestore {}

import { iHasParentPath } from 'src/declarations/interfaces';

import {
  iHasDataStorageFactory, iHasFirestore, iHasId, iHasResolvedBasePath,
} from '../data-storage-interfaces';

export interface iLocalFileCharacterSheetDataStorageProps
  extends iBaseCharacterSheetDataStorageProps,
    iHasResolvedBasePath {}

export interface iFirestoreCharacterSheetDataStorageProps
  extends iBaseCharacterSheetDataStorageProps,
    iHasFirestore {}

export interface iBaseCharacterSheetDataStorageProps
  extends iHasId,
    iHasParentPath,
    iHasDataStorageFactory {}

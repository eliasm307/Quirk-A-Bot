import { iHasParentPath } from 'common/src/declarations';

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

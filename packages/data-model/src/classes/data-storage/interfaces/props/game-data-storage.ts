import { iHasParentPath } from '../../../../declarations/interfaces';
import { iHasDataStorageFactory, iHasFirestore, iHasId } from '../data-storage-interfaces';

export interface iBaseGameDataStorageProps
  extends iHasId,
    iHasParentPath,
    iHasDataStorageFactory {}

export interface iFirestoreCharacterSheetDataStorageProps
  extends iBaseGameDataStorageProps,
    iHasFirestore {}

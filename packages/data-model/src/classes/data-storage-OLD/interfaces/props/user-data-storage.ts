import { iHasParentPath } from '@quirk-a-bot/common';

import { iHasFirestore, iHasId } from '../../../../declarations/interfaces';
import { iHasDataStorageFactory } from '../data-storage-interfaces';

export interface iUserDataStorageFactoryProps extends iHasId, iHasParentPath {}

export interface iBaseUserDataStorageProps
  extends iHasId,
    iHasDataStorageFactory {}

export interface iFirestoreUserDataStorageProps
  extends iBaseUserDataStorageProps,
    iHasFirestore {}

export interface iFirestoreCompositeUserDataStorageProps
  extends iBaseUserDataStorageProps,
    iHasFirestore {}

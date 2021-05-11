import { BaseChangeProps, iHasParentPath } from '@quirk-a-bot/common';

import { iHasFirestore, iHasId } from '../../../../declarations/interfaces';
import { iGameData } from '../../../game/interfaces/game-interfaces';
import { iCharacterData } from '../../../game/interfaces/game-player-interfaces';
import { iHasDataStorageFactory } from '../data-storage-interfaces';

// ? really similar to iCharacterSheetDataStorageFactoryProps, should they be the same?
export interface iGameDataStorageFactoryProps extends iHasId, iHasParentPath {
  characterCollectionChangeHandler: (
    props: BaseChangeProps<iCharacterData>
  ) => void;
  gameDataChangeHandler: (props: BaseChangeProps<iGameData>) => void;
}

export interface iBaseGameDataStorageProps
  extends iHasId,
    iHasParentPath,
    iHasDataStorageFactory {}

export interface iFirestoreGameDataStorageProps
  extends iBaseGameDataStorageProps,
    iHasFirestore {
  characterCollectionChangeHandler: (
    props: BaseChangeProps<iCharacterData>
  ) => void;
  gameDataChangeHandler: (props: BaseChangeProps<iGameData>) => void;
}

export interface iFirestoreCompositeGameDataStorageProps
  extends iBaseGameDataStorageProps,
    iHasFirestore {
  characterCollectionChangeHandler: (
    props: BaseChangeProps<iCharacterData>
  ) => void;
  gameDataChangeHandler: (props: BaseChangeProps<iGameData>) => void;
}

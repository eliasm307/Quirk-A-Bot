import { Observable } from 'rxjs';

import { auth, CHARACTER_COLLECTION_NAME, iHasParentPath } from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import getFirestoreCollectionChangeObservable from '../../../utils/getFirestoreCollectionChangeObservable';
import { isCharacterSheetData } from '../../../utils/type-predicates';
import isGameData from '../../../utils/type-predicates/isGameData';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { createPath } from '../../data-storage/utils/createPath';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { GameModelReader, UserModelReader } from '../interfaces/interfaces';
import AbstractDocumentReader from './AbstractDocumentReader';

// todo test

export default class UserFirestoreCompositeModelReader
  implements UserModelReader
{
  adminGameCollectionData$: Observable<iGameData[]>;
  characterCollectionChange$: Observable<iCharacterSheetData[]>;
  characterGameCollectionData$: Observable<iGameData[]>;
  data$: Observable<iGameData | undefined> | null;
  id: string;

  constructor() {
    if (!auth.currentUser)
      throw Error(
        `Cannot update user because no user is signed in, current user is ${typeof auth.currentUser}`
      );

    this.id = auth.currentUser.uid;

    this.characterCollectionChange$ = getFirestoreCollectionChangeObservable({
      collectionPath: createPath(this.path, CHARACTER_COLLECTION_NAME),
      dataPredicate: isCharacterSheetData,
    });
  }

  dispose(): void {
    throw new Error("Method not implemented.");
  }
}

import { Observable } from 'rxjs';

import {
  auth, CHARACTER_COLLECTION_NAME, firestore, GAMES_COLLECTION_NAME, iHasParentPath,
} from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import observableFromFirestoreCollection from '../../../utils/observables/observableFromFirestoreCollection';
import { isCharacterSheetData } from '../../../utils/type-predicates';
import isGameData from '../../../utils/type-predicates/isGameData';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { createPath } from '../../data-storage/utils/createPath';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { iUserData } from '../../user/interfaces';
import { GameModelReader, UserModelReader } from '../interfaces/interfaces';
import AbstractDocumentReader from './AbstractDocumentReader';

// todo test

export default class UserFirestoreCompositeModelReader
  implements UserModelReader
{
  data$: Observable<iUserData | undefined> | null;
  id: string;

  constructor() {
    if (!auth.currentUser)
      throw Error(
        `Cannot update user because no user is signed in, current user is ${typeof auth.currentUser}`
      );

    this.id = auth.currentUser.uid;

    const gameUsersField: keyof iGameData = "users";

    auth.onAuthStateChanged({});

    const refsToGamesForCurrentUser = firestore
      .collection(GAMES_COLLECTION_NAME)
      .where(`${gameUsersField}.${this.id}`, "!=", false);

    this.characterCollectionChange$ = observableFromFirestoreCollection({
      firestoreCollectionRef: refsToGamesForCurrentUser,
      dataPredicate: isGameData,
    });
  }

  dispose(): void {
    throw new Error("Method not implemented.");
  }
}

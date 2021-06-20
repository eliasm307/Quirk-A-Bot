import { Observable } from 'rxjs';

import { auth, firestore, GAMES_COLLECTION_NAME } from '@quirk-a-bot/common';

import observableFromFirebaseAuthUser from '../../../utils/observables/observableFromFirebaseAuthUser';
import observableFromFirestoreCollection from '../../../utils/observables/observableFromFirestoreCollection';
import isGameData from '../../../utils/type-predicates/isGameData';
import isUserData from '../../../utils/type-predicates/isUserData';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { iUserData } from '../../user/interfaces';
import { iUserModelReader } from '../interfaces';

// todo test

export default class UserFirestoreCompositeModelReader
  implements iUserModelReader
{
  data$: Observable<iUserData | undefined>;
  gameCollectionData$: Observable<iGameData[]>;
  id: string;

  constructor() {
    if (!auth.currentUser)
      throw Error(
        `Cannot update user because no user is signed in, current user is ${typeof auth.currentUser}`
      );

    this.id = auth.currentUser.uid;

    const gameUsersField: keyof iGameData = "users";

    this.data$ = observableFromFirebaseAuthUser({ dataPredicate: isUserData });

    const refsToGamesForCurrentUser = firestore
      .collection(GAMES_COLLECTION_NAME)
      .where(`${gameUsersField}.${this.id}`, "!=", false);

    this.gameCollectionData$ = observableFromFirestoreCollection({
      firestoreCollectionRef: refsToGamesForCurrentUser,
      dataPredicate: isGameData,
    });
  }

  dispose(): void {
    console.warn(__filename, `Dispose method empty`);
  }
}

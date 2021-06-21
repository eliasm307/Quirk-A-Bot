import { firestoreFieldValues } from 'packages/common/dist/src/FirebaseExports';
import { Observable } from 'rxjs';

import { auth, DEFAULT_CHARACTER_IMAGE_URL, DEFAULT_CHARACTER_NAME } from '@quirk-a-bot/common';

import { iGameData, iUserData } from '../../../declarations/interfaces';
import { createGame } from '../../data-models/firestore-composite/GameModelWriter';
import UserModelReader from '../../data-models/firestore-composite/UserModelReader';
import UserModelWriter from '../../data-models/firestore-composite/UserModelWriter';
import { iUserModelReader, iUserModelWriter } from '../../data-models/interfaces';
import { iUserViewModel } from './interfaces';

// todo test
interface CreateGameProps {
  description: string;
}

// todo expand this to use readers and writers so other user profiles can be viewed with read access

export default class UserViewModel implements iUserViewModel {
  #instance?: UserViewModel;
  #modelReader: iUserModelReader;
  #modelWriter: iUserModelWriter;
  data$: Observable<iUserData | undefined> | null;
  gameCollectionData$: Observable<iGameData[]>;
  id: string;

  // ? should this be a singleton?
  constructor() {
    if (!auth.currentUser)
      throw Error(
        `Cannot get user view model because no user is signed in, current user is ${typeof auth.currentUser}`
      );

    this.id = auth.currentUser.uid;
    this.#modelWriter = new UserModelWriter();
    this.#modelReader = new UserModelReader();
    this.data$ = this.#modelReader.data$;
    this.gameCollectionData$ = this.#modelReader.gameCollectionData$;
  }

  async createGame(props: CreateGameProps): Promise<void> {
    await createGame({ ...props, creatorId: this.id });
  }

  dispose(): void {
    console.warn(__filename, `Dispose method empty`);
  }

  setDisplayName(displayName: string): void {
    this.updateModel({ displayName: displayName || DEFAULT_CHARACTER_NAME });
  }

  setPhotoUrl(url: string): void {
    this.updateModel({ photoURL: url || DEFAULT_CHARACTER_IMAGE_URL });
  }

  private updateModel(updates: Partial<Omit<iUserData, "id">>): void {
    this.#modelWriter.update(updates);
  }
}

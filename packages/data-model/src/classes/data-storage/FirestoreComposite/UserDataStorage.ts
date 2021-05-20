import {
  ChangeHandler, InconsistentCompositeDocument, isString, newIsArrayPredicate, USER_COLLECTION_NAME,
} from '@quirk-a-bot/common';

import returnValueWhenLoaded from '../../../utils/returnValueWhenLoaded';
import { iUserData } from '../../user/interfaces';
import { iUserDataStorage } from '../interfaces/data-storage-interfaces';
import { iFirestoreCompositeUserDataStorageProps } from '../interfaces/props/user-data-storage';

export default class FirestoreCompositeUserDataStorage
  implements iUserDataStorage
{
  #compositeDocument: InconsistentCompositeDocument<iUserData>;
  #data?: iUserData;
  #externalChangeHandler?: ChangeHandler<iUserData>;
  path: string;

  constructor(props: iFirestoreCompositeUserDataStorageProps) {
    const { id, dataStorageFactory, firestore } = props;

    this.path = dataStorageFactory.createPath(USER_COLLECTION_NAME, id);

    // load and listen to game document
    this.#compositeDocument = InconsistentCompositeDocument.load<iUserData>({
      firestore,
      handleChange: ({ newData }) => {
        this.#data = newData && { ...newData };
        if (this.#externalChangeHandler) this.#externalChangeHandler(newData);
      },
      path: this.path,
      valuePredicates: {
        adminGames: newIsArrayPredicate(isString),
        name: isString,
        playerGames: newIsArrayPredicate(isString),
        uid: isString,
      },
    });
  }

  cleanUp(): boolean {
    this.#compositeDocument.cleanUp();
    return true;
  }

  data(): Promise<iUserData> {
    return returnValueWhenLoaded(() => this.#data, "game data");
  }

  onChange(handler: ChangeHandler<iUserData>): void {
    this.#externalChangeHandler = handler;
  }

  async update(updates: Partial<Omit<iUserData, "id" | "uid">>): Promise<void> {
    await this.#compositeDocument.update(updates);
  }
}

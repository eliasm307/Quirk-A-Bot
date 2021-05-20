import {
  ChangeHandler, InconsistentCompositeDocument, isString, USER_COLLECTION_NAME,
} from '@quirk-a-bot/common';

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
        adminGames,
        name,
        playerGames: isArrayOf
        uid: isString,
      },
    });
  }

  cleanUp(): boolean {
    throw new Error("Method not implemented.");
  }

  data(): Promise<iUserData> {
    throw new Error("Method not implemented.");
  }

  onChange(handler: ChangeHandler<iUserData>): void {
    throw new Error("Method not implemented.");
  }

  update(props: Partial<Omit<iUserData, "id" | "uid">>): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

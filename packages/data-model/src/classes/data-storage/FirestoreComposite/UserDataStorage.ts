import {
  ChangeHandler, InconsistentCompositeDocument, isString, USER_COLLECTION_NAME,
} from '@quirk-a-bot/common';

import returnValueWhenLoaded from '../../../utils/returnValueWhenLoaded';
import isUserData from '../../../utils/type-predicates/isUserData';
import { iUserData } from '../../user/interfaces';
import { iUserDataStorage } from '../interfaces/data-storage-interfaces';
import { iFirestoreCompositeUserDataStorageProps } from '../interfaces/props/user-data-storage';

export default class FirestoreCompositeUserDataStorage
  implements iUserDataStorage
{
  #compositeDocument: InconsistentCompositeDocument<iUserData>;
  #data?: iUserData;
  #externalChangeHandler?: ChangeHandler<iUserData>;
  id: string;
  path: string;

  private constructor(
    props: iFirestoreCompositeUserDataStorageProps & { data?: iUserData }
  ) {
    const { id, dataStorageFactory, firestore, data } = props;

    this.id = id;
    this.#data = data;
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
        displayName: isString,
        id: isString,
        photoURL: isString,
      },
    });
  }

  static async load(
    props: iFirestoreCompositeUserDataStorageProps
  ): Promise<FirestoreCompositeUserDataStorage> {
    const { id, firestore } = props;

    const userDoc = await firestore
      .collection(USER_COLLECTION_NAME)
      .doc(id)
      .get();

    if (!userDoc || !userDoc.exists)
      throw Error(
        `Could not load user with uid "${id}", no data found on this user, need to sign up first`
      );

    const data = userDoc.data();

    if (!isUserData(data))
      throw Error(
        `Could not load user with uid "${id}", data was invalid format`
      );

    return new FirestoreCompositeUserDataStorage({ ...props, data });
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

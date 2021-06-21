import { ChangeHandler } from '@quirk-a-bot/common';
import { USER_COLLECTION_NAME } from '@quirk-a-bot/common/src/constants';

import { iHasFirestore, iHasId } from '../../declarations/interfaces';
import {
  iHasDataStorageFactory, iUserDataStorage,
} from '../data-storage/interfaces/data-storage-interfaces';
import { iUserData, iUserViewModel } from './interfaces';

export interface iUserProps
  extends iHasId,
    iHasDataStorageFactory,
    iHasFirestore {}

export default class UserViewModelOLD implements iUserViewModel {
  /** Existing singleton instances of this class */
  protected static instances: Map<string, UserViewModelOLD> = new Map<
    string,
    UserViewModelOLD
  >();

  #dataStorage: iUserDataStorage;
  id: string;
  path: string;

  private constructor(
    props: iUserProps & { userDataStorage: iUserDataStorage }
  ) {
    const { id, userDataStorage } = props;
    this.id = id;
    this.path = userDataStorage.path;
    this.#dataStorage = userDataStorage;
  }

  static async load(props: iUserProps): Promise<UserViewModelOLD> {
    const { dataStorageFactory, id } = props;

    dataStorageFactory.assertIdIsValid(id);

    const preExistingInstance = UserViewModelOLD.instances.get(id);
    if (preExistingInstance) return preExistingInstance;

    try {
      const userDataStorage = await dataStorageFactory.newUserDataStorage({
        ...props,
        parentPath: USER_COLLECTION_NAME,
      });

      return new UserViewModelOLD({
        ...props,
        userDataStorage,
      });
    } catch (error) {
      console.error(__filename, { error });
      throw Error(
        `Could not create user instance with id "${id}", Message: ${JSON.stringify(
          error
        )}`
      );
    }
  }

  cleanUp(): boolean {
    this.#dataStorage.cleanUp();
    return true;
  }

  data(): Promise<iUserData> {
    return this.#dataStorage.data();
  }

  onChange(handler: ChangeHandler<iUserData>): void {
    this.#dataStorage.onChange(handler);
  }

  update(updates: Partial<Omit<iUserData, "uid" | "id">>): Promise<void> {
    return this.#dataStorage.update(updates);
  }
}

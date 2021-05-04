import pathModule from 'path';

import { Firestore } from '@quirk-a-bot/common';

import { CORE_TRAIT_COLLECTION_NAME } from '../../../../../common/src/constants';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import isTraitData from '../../../utils/type-predicates/isTraitData';
import UpdateLogEvent from '../../log/log-events/UpdateLogEvent';
import { iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import AbstractTraitDataStorage from '../AbstractTraitDataStorage';
import { iBaseTraitDataStorage } from '../interfaces/data-storage-interfaces';
import { iFirestoreTraitDataStorageProps } from '../interfaces/props/trait-data-storage';
import { createPath } from '../utils/createPath';

export default class FirestoreTraitDataStorage<
    N extends TraitNameUnionOrString,
    V extends TraitValueTypeUnion
  >
  extends AbstractTraitDataStorage<N, V>
  implements iBaseTraitDataStorage<N, V> {
  #firestore: Firestore;
  path: string;

  constructor(props: iFirestoreTraitDataStorageProps<N, V>) {
    super(props);
    const { firestore, parentPath, defaultValueIfNotDefined, name } = props;
    this.#firestore = firestore;
    this.path = this.createTraitPath(parentPath, name);

    // const timerName = `Time to initialise trait "${this.path}"`;

    // console.time(timerName);
    // make sure trait exists, then set listeners on it
    this.initAsync()
      /*
      .then(() => {
        // console.warn(`Successfully initialised trait with path ${this.path} and value ${this.private.value}`);
        return null;
      })
      .finally(
        () => console.timeEnd(timerName)
      )*/
      .catch(console.error);
  }

  #unsubscribeFromEventListeners: () => void = () => null;

  cleanUp(): boolean {
    try {
      this.#unsubscribeFromEventListeners();
      return true;
    } catch (error) {
      console.error(
        __filename,
        `Error cleaning up listeners for trait with path ${this.path}`
      );
      return false;
    }
  }

  /** Function to be called after the local value is changed, to signal that the data storage value should also be changed */
  protected async afterValueChange(oldValue: V, newValue: V): Promise<void> {
    await this.handleChangeAsync(oldValue, newValue);
  }

  protected async assertTraitExistsOnDataStorage(
    traitData: iBaseTraitData<N, V>
  ): Promise<void> {
    // try getting the document
    const doc = await this.#firestore.doc(this.path).get();

    // assert document exists
    if (!doc || !doc.exists) {
      // if the document doesnt exist then try adding it
      // console.log(__filename, `Trait does not exist at path ${this.path}, adding this now`);
      try {
        await this.#firestore.doc(this.path).set(traitData);
        // console.log(__filename, `Trait added at path ${this.path}`, { path: this.path, traitData });
      } catch (error) {
        console.error(__filename, { error });
        throw Error(
          `Trait with name ${this.name} did not exist and could not be added to data store`
        );
      }
    }
  }

  /** Creates a trait path that satisfies firestore requirements */
  protected createTraitPath(parentPath: string, name: string): string {
    const segments = parentPath.split("/");

    if (segments.length % 2) {
      // if parent is a collection (even path segments) then return as normal
      return createPath(parentPath, name);
    }

    // if parent is a document (odd path segments) then put this in a core collection, to satisfy firestore requirements
    return createPath(`${parentPath}/${CORE_TRAIT_COLLECTION_NAME}`, name);
  }

  /** Attaches change event listeners for this trait via its parent collection, and returns the unsubscribe function */
  private async attachFirestoreEventListenersAsync(
    parentCollectionPath: string
  ): Promise<() => void> {
    // todo test event listener

    let unsubscriber = () => {};

    try {
      // subscribe to collection level changes
      unsubscriber = this.#firestore
        .collection(parentCollectionPath)
        .where("name", "==", this.name)
        .onSnapshot((querySnapshot) => {
          // ? delete
          // confirm query only returns 1 result
          /*
          if (querySnapshot.size !== 1) {
						console.error(
							__filename,
							`There should be exactly 1 trait named "${this.name}" in collection "${parentCollectionPath}", however ${querySnapshot.size} where found`,
							{ traitName: this.name, traitPath: this.path, parentCollectionPath }
						);*/
          /*
          throw Error(
							`There should be exactly 1 trait named "${this.name}" in collection "${parentCollectionPath}", however ${querySnapshot.size} where found`
						);*/
          //	}

          querySnapshot.docChanges().forEach((change) => {
            const data: any = change.doc.data();

            if (!isTraitData(data))
              throw Error(
                `Change on trait named ${
                  this.name
                } in collection ${parentCollectionPath}, resulted in data that doesnt satisfy the trait data shape. Data: ${JSON.stringify(
                  data
                )}`
              );

            // logFirestoreChange(change, console.warn);
            if (change.type === "modified") {
              // console.warn('Modified document: ', { data });
              // apply private modification
              const newValue = data.value as V;
              this.private.value = newValue;

              // ? log this change? since this is async, you need to manually make sure logs are in right order?
              this.logger.log(
                new UpdateLogEvent({
                  property: this.name,
                  newValue,
                  oldValue: this.private.value,
                })
              );
            }
          });
        });
    } catch (error) {
      console.error(__filename, { error });
      try {
        unsubscriber();
      } finally {
        console.error(
          `Error setting change listener on trait named ${this.name} in collection ${parentCollectionPath}}`
        );
      }
    }
    return unsubscriber;
  }

  private async handleChangeAsync(oldValue: V, newValue: V) {
    try {
      const doc = await this.#firestore.doc(this.path).get();

      // ? is this right? does doc.exists actually mean the document doesn exist?
      // check document exists
      if (!doc.exists) {
        // if it doesnt exist, it might be a left over from an old delete, delete it again just incase
        // console.log(__filename, `Attempting to delete trait document ${this.#path}, it is shown as not existing`);
        // await doc.ref.delete();

        return console.error(
          `Trait document does not exist at path ${this.path}`,
          {
            traitPath: this.path,
            docData: doc.data(),
            docId: doc.id,
            docExists: doc.exists,
            docHasPendingWrites: doc.metadata.hasPendingWrites,
          }
        );
      }

      // try updating value
      try {
        return await doc.ref.update({ value: this.value });
      } catch (error) {
        console.error(
          __filename,
          `Error updating trait ${this.name} (${this.path}) from ${oldValue} to ${newValue}`,
          {
            error,
          }
        );
      }
    } catch (error) {
      console.error(__filename, { error });
    }
  }

  private async initAsync() {
    try {
      await this.assertTraitExistsOnDataStorage({
        name: this.name,
        value: this.private.value,
      });
    } catch (error) {
      /*
      console.error(
        __filename,
        `Could not assert that trait with name ${this.name} exists in collection at path ${this.path}`,
        { error }
      );
      */
    }
    const parentPath = pathModule.dirname(this.path);

    try {
      // add event liseners
      this.#unsubscribeFromEventListeners = await this.attachFirestoreEventListenersAsync(
        parentPath
      );
    } catch (error) {
      this.#unsubscribeFromEventListeners();
      console.error(
        __filename,
        `Could not add event listeners to trait with name ${this.name} at path ${this.path}`,
        {
          error,
          parentPath,
          path: this.path,
        }
      );
    }
  }
}

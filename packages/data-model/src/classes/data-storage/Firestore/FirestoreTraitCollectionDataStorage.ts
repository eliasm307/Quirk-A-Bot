import { Firestore } from '@quirk-a-bot/common';

import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import isTraitData from '../../../utils/type-predicates/isTraitData';
import { iBaseTrait, iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import AbstractTraitCollectionDataStorage from '../AbstractTraitCollectionDataStorage';
import { iBaseTraitDataStorage } from '../interfaces/data-storage-interfaces';
import {
  iFirestoreTraitCollectionDataStorageProps,
} from '../interfaces/props/trait-collection-data-storage';
import { iBaseTraitDataStorageProps } from '../interfaces/props/trait-data-storage';
import FirestoreTraitDataStorage from './FirestoreTraitDataStorage';

export default class FirestoreTraitCollectionDataStorage<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion,
  D extends iBaseTraitData<N, V>,
  T extends iBaseTrait<N, V, D>
> extends AbstractTraitCollectionDataStorage<N, V, D, T> {
  #firestore: Firestore;

  constructor(props: iFirestoreTraitCollectionDataStorageProps<N, V, D, T>) {
    super({
      ...props,
    });
    const { firestore, initialData } = props;
    this.#firestore = firestore;
    this.initMap(initialData);
    this.init();
  }

  #unsubscribeFromEventListeners: () => void = () => {};

  protected afterAddInternal(name: N): void {
    // do nothing, traits add themselves to firestore
  }

  protected afterTraitCleanUp(): boolean {
    try {
      this.#unsubscribeFromEventListeners();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  protected async deleteTraitFromDataStorage(name: N): Promise<void> {
    try {
      const queryDocs = await this.#firestore
        .collection(this.path)
        .where("name", "==", name)
        .get();

      if (queryDocs.size === 0) {
        throw Error(
          `There should have been exactly 1 trait with name ${name} in collection at path ${this.path}, instead found none`
        );
      }
      queryDocs.forEach(async (doc) => {
        await doc.ref.delete().catch((error) => {
          console.error(
            __filename,
            `Could not delete trait with name ${name}`,
            { error }
          );
        });
      });
      return;
    } catch (error) {
      return Promise.reject(Error(error));
    }
  }

  protected newTraitDataStorage: (
    props: iBaseTraitDataStorageProps<N, V>
  ) => iBaseTraitDataStorage<N, V> = (props) =>
    new FirestoreTraitDataStorage({ ...props, firestore: this.#firestore });

  // todo extract this as a util
  /** Attaches change event listeners for this trait via its parent collection, and returns the unsubscribe function */
  private attachFirestoreEventListeners(
    parentCollectionPath: string
  ): () => void {
    // todo test event listener

    let unsubscriber = () => {};

    try {
      // subscribe to collection level changes
      unsubscriber = this.#firestore
        .collection(parentCollectionPath)
        .onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            const data: any = change.doc.data();

            // confirm it is trait data
            if (!isTraitData(data))
              throw Error(
                `Change on trait collection named ${
                  this.name
                }, resulted in data that doesnt satisfy the trait data shape. Data: ${JSON.stringify(
                  data
                )}`
              );

            const { name, value } = data as iBaseTraitData<N, V>;

            // ? log these changes? since this is async, you need to manually make sure logs are in right order?
            // handle collection changes internally
            switch (change.type) {
              case "added":
                // add to internal collection
                if (!this.map.has(name))
                  this.map.set(name, this.createTraitInstance(name, value));
                break;
              case "removed":
                // remove from internal collection
                this.map.delete(name);
                break;
              case "modified":
                break;
              default:
                console.warn(
                  __filename,
                  `Unknown change type ${change.type as string}`
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
          `Error setting change listener on trait collection named ${this.name}}`,
          {
            name: this.name,
            path: this.path,
          }
        );
      }
    }
    return unsubscriber;
  }

  private init() {
    // ? should collections be asserted? when traits are initialised, these should auto populate collections
    /*
		try {
			await this.assertTraitExistsOnDataStorage({ name: this.name, value: this.private.value });
		} catch (error) {
			console.error(
				__filename,
				`Could not assert that trait with name ${this.name} exists in collection at path ${this.path}`,
				{ error }
			);
		}
		*/

    // add event liseners
    try {
      this.#unsubscribeFromEventListeners = this.attachFirestoreEventListeners(
        this.path
      );
    } catch (error) {
      this.#unsubscribeFromEventListeners();
      console.error(
        __filename,
        `Could not add event listeners to trait collection with name ${this.name} at path ${this.path}`,
        {
          error,
          path: this.path,
        }
      );
    }
  }
}

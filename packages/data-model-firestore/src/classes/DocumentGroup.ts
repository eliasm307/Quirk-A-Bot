import { GenericObject, iDocumentGroup, iSubDocument } from 'src/declarations/interfaces';
import objectsAreEqual from 'src/utils/objectsAreEqual';

import {
  Firestore, FirestoreDocumentObserver, FirestoreDocumentObserverProps,
} from '@quirk-a-bot/firebase-utils';

import SubDocument from './SubDocument';

export interface DocumentGroupProps<K extends string, V>
  extends Omit<
    FirestoreDocumentObserverProps<GenericObject<K, V>>,
    "handler"
  > {}

export default abstract class DocumentGroup<K extends string, V extends any>
  implements iDocumentGroup<K, V> {
  readonly path: string;

  #private: { firestore: Firestore; subDocuments: Map<K, iSubDocument<V>> };

  constructor(props: DocumentGroupProps<K, V>) {
    const { firestore, path } = props;

    this.#private = { firestore, subDocuments: new Map<K, iSubDocument<V>>() };
    this.path = path;

    new FirestoreDocumentObserver({
      ...props,
      handleChange: async (newData) => await this.handleChange(newData),
    });
  }

  get(key: K): iSubDocument<V> | undefined {
    return this.#private.subDocuments.get(key);
  }

  toArray(): iSubDocument<V>[] {
    return Array.from(this.#private.subDocuments.values());
  }

  private async handleChange(newData: GenericObject<K, V>) {
    if (!newData) console.warn(__filename, `newData was ${typeof newData}`);

    const newSubDocumentCount = Object.keys(newData).length;
    const existingSubDocumentCount = this.#private.subDocuments.size;
    let affectedSubDocuments = Math.abs(
      newSubDocumentCount - existingSubDocumentCount
    );

    if (newSubDocumentCount > existingSubDocumentCount) {
      // sub documents added
      this.handleSubDocumentAddition(newData);
    } else if (newSubDocumentCount < existingSubDocumentCount) {
      // sub documents removed
      this.handleSubDocumentRemoval(newData);
    } else {
      // sub documents changed
      affectedSubDocuments = this.handleSubDocumentChange(newData);
    }

    // just double check if assumption that multiple documents can be affected in a snapshot is true
    if (affectedSubDocuments > 1) {
      console.error(
        __filename,
        `Multiple documents can be affected in a snapshot`,
        { newSubDocumentCount, existingSubDocumentCount }
      );
      throw Error(
        `Multiple documents can be affected in a snapshot, ${affectedSubDocuments} documents affected`
      );
    }
  }

  private handleSubDocumentAddition(newData: GenericObject<K, V>) {
    for (let [key, value] of Object.entries(newData)) {
      // add missing sub document and stop (assuming there is only 1)
      if (!this.#private.subDocuments.has(key as K))
        return this.#private.subDocuments.set(
          key as K,
          new SubDocument({
            firestore: this.#private.firestore,
            data: value as V,
            key,
            parentDocumentPath: this.path,
            firestoreDataUpdater: (newValue: V) =>
              this.subDocumentUpdater(key as K, newValue),
          })
        );
    }
  }

  private handleSubDocumentChange(newData: GenericObject<K, V>): number {
    let affectedDocuments = 0;
    for (let [key, value] of Object.entries(newData)) {
      // update changed documents only
      const subDocument = this.#private.subDocuments.get(key as K);

      if (!subDocument)
        throw Error(
          `Could not handleSubDocumentChange, document with key ${key} doesnt exist`
        );

      if (!objectsAreEqual(subDocument.data, value as V)) {
        subDocument.data = value as V;
        affectedDocuments++;
      }
    }
    return affectedDocuments;
  }

  private handleSubDocumentRemoval(newData: GenericObject<K, V>) {
    for (let key of this.#private.subDocuments.keys()) {
      // remove extra sub document and stop (assuming there is only 1)
      if (!newData[key]) return this.#private.subDocuments.delete(key);
    }
  }

  private async subDocumentUpdater(key: K, newValue: V) {
    // todo move to util
    try {
      await this.#private.firestore
        .doc(this.path)
        .set({ [key]: newValue }, { merge: true });
    } catch (error) {
      console.error(__filename, `Error setting data to sub-document`, {
        key,
        parentDocumentPath: this.path,
      });
    }
  }
}

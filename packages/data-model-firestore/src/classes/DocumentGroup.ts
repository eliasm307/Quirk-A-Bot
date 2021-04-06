import objectsAreEqual from 'src/utils/objectsAreEqual';

import {
  Firestore, FirestoreDocumentObserver, FirestoreDocumentObserverProps,
} from '@quirk-a-bot/firebase-utils';

import { GenericObject, iDocumentGroup, iSubDocument } from '../declarations/interfaces';
import SubDocument from './SubDocument';

export interface DocumentGroupLoaderProps<K extends string, V>
  extends FirestoreDocumentObserverProps<GenericObject<K, V>> {}

interface DocumentGroupProps<K extends string, V>
  extends DocumentGroupLoaderProps<K, V> {
  initialDocumentData: GenericObject<K, V>;
}

export default class DocumentGroup<_K extends string, _V>
  implements iDocumentGroup<_K, _V> {
  readonly path: string;

  #private: {
    firestore: Firestore;
    subDocuments: Map<_K, iSubDocument<_V>>;
    data?: GenericObject<_K, _V>;
    observer: FirestoreDocumentObserver<GenericObject<_K, _V>>;
  };

  // todo only return instance when data is loaded initially from firestore
  private constructor(props: DocumentGroupProps<_K, _V>) {
    const { firestore, path } = props;
    const observer = new FirestoreDocumentObserver({
      ...props,
      handleChange: async (newData) => this.handleChange(newData),
    });

    this.path = path;
    this.#private = {
      firestore,
      subDocuments: new Map<_K, iSubDocument<_V>>(),
      observer,
    };
  }

  static async load<K extends string, V>(
    props: DocumentGroupLoaderProps<K, V>
  ) {
    const { firestore, documentSchemaPredicate, path } = props;

    const doc = await firestore.doc(path).get();

    const initialDocumentData = doc.data();

    if (!documentSchemaPredicate(initialDocumentData)) {
      const error = `initial data does not match provided predicate`;
      console.error(error, { initialDocumentData, documentPath: path });
      throw Error(error);
    }
    return new DocumentGroup({ ...props, initialDocumentData });
  }

  cleanUp(): void {
    this.#private.observer.unsubscribe();
  }

  get(key: _K): iSubDocument<_V> | undefined {
    return this.#private.subDocuments.get(key);
  }

  toArray(): iSubDocument<_V>[] {
    return Array.from(this.#private.subDocuments.values());
  }

  private async handleChange(newData: GenericObject<_K, _V>) {
    if (!newData) console.warn(__filename, `newData was ${typeof newData}`);

    // update local data
    this.#private.data = newData;

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

  private handleSubDocumentAddition(newData: GenericObject<_K, _V>) {
    for (const [_key, _value] of Object.entries(newData)) {
      const key = _key as _K;
      const data = _value as _V;
      // add missing sub document and stop (assuming there is only 1)
      if (!this.#private.subDocuments.has(key))
        return this.#private.subDocuments.set(
          key,
          new SubDocument({
            firestore: this.#private.firestore,
            data,
            key,
            parentDocumentPath: this.path,
            updateOnDataStorage: (newValue: _V) =>
              this.subDocumentUpdater(key, newValue),
            deleteFromDataStorage: () => this.subDocumentRemover(key),
          })
        );
    }
  }

  private handleSubDocumentChange(newData: GenericObject<_K, _V>): number {
    let affectedDocuments = 0;
    for (const [key, value] of Object.entries(newData)) {
      // update changed documents only
      const subDocument = this.#private.subDocuments.get(key as _K);

      if (!subDocument)
        throw Error(
          `Could not handleSubDocumentChange, document with key ${key} doesnt exist`
        );

      if (!objectsAreEqual(subDocument.data, value as _V)) {
        subDocument.data = value as _V;
        affectedDocuments++;
      }
    }
    return affectedDocuments;
  }

  private handleSubDocumentRemoval(newData: GenericObject<_K, _V>) {
    for (const key of this.#private.subDocuments.keys()) {
      // remove extra sub document and stop (assuming there is only 1)
      if (!newData[key as _K]) return this.#private.subDocuments.delete(key);
    }
  }

  private async subDocumentRemover(key: _K) {
    // todo move to util
    if (!this.#private.data)
      return console.warn(
        __filename,
        `Could not delete sub-document with key ${key} at document path ${this.path}`
      );

    const {
      [key]: excludedSubDocument,
      ...dataAfterDelete
    } = this.#private.data;
    /*
    const dataAfterDelete: any = { ...this.#private.data };
    delete dataAfterDelete[key];
    */

    try {
      await this.#private.firestore.doc(this.path).set(dataAfterDelete);
    } catch (error) {
      console.error(
        __filename,
        `Error setting new data with deleted sub-document`,
        {
          key,
          parentDocumentPath: this.path,
        }
      );
    }
  }

  private async subDocumentUpdater(key: _K, newValue: _V) {
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

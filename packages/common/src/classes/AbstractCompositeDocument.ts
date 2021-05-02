import { iCompositeDocument, iSubDocument } from '../declarations/interfaces';
import { Firestore } from '../FirebaseExports';
import objectsAreEqual from '../utils/objectsAreEqual';
import FirestoreDocumentObserver, {
  FirestoreDocumentChangeData, FirestoreDocumentObserverLoaderProps, FirestoreDocumentObserverProps,
} from './FirestoreDocumentObserver';
import SubDocument from './SubDocument';

export interface AbstractCompositeDocumentLoaderProps<
  S extends Record<string, any>
> extends FirestoreDocumentObserverLoaderProps<S> {}

export interface AbstractCompositeDocumentProps<S extends Record<string, any>>
  extends AbstractCompositeDocumentLoaderProps<S> {
  initialData: S;
}

// export interface FirestoreDocumentObserverProps<K extends string, V> {}

export default abstract class AbstractCompositeDocument<
  S extends Record<string, any>
> implements iCompositeDocument<S> {
  readonly path: string;

  #private: {
    firestore: Firestore;
    subDocuments: Map<keyof S, iSubDocument<S[keyof S]>>;
    data?: S;
    observer: FirestoreDocumentObserver<S>;
  };

  /*
  abstract load<C extends AbstractCompositeDocument<S>>(
    props: CompositeDocumentLoaderProps<S>
  ): C;
  */

  // todo only return instance when data is loaded initially from firestore
  protected constructor(props: AbstractCompositeDocumentProps<S>) {
    const { firestore, path, handleChange } = props;

    this.path = path;
    this.#private = {
      firestore,
      subDocuments: new Map(),
      observer: new FirestoreDocumentObserver({
        ...props,
        handleChange: (newData) => {
          // handle change internally first
          this.handleChange(newData);
          // then use custom change handler
          handleChange(newData);
        },
      }),
    };
  }

  /** Loads an observer for the firestore document and returns the initial data also */
  static async loadObserver<S extends Record<string, any>>(
    props: AbstractCompositeDocumentLoaderProps<S>
  ): Promise<{
    initialData: S;
  }> {
    // ? is this required? this is just to load initial data but the observer will do that anyway. Only benefit of this is you can await data to be loaded
    const { firestore, schemaPredicate, path } = props;

    const doc = await firestore.doc(path).get();

    const initialData = doc.data() || {};

    // check initial document schema
    if (!schemaPredicate(initialData)) {
      const error = "Initial data doesnt satisfy schema predicate";
      console.error(__filename, error, {
        path,
        initialDocumentData: initialData,
      });
      throw Error(error);
    }

    /*
    const observerCreator = (
      handleChange
    ) =>
      */

    /*
    return new AbstractCompositeDocument({
      ...props,
      initialDocumentData,
      observer,
    });
    */

    return {
      initialData,
    };
  }

  // todo delete
  // ! composite document schemas might not always be consistent records, so verifySchema needs to be a dependency, so the right validator is used for the provided schema
  /*
  static verifySchema<K extends string | number, V>(
    data: any,
    keyPredicate: (key: any) => key is K,
    valuePredicate: (value: any) => value is K
  ): data is Record<K, V> {
    if (typeof data !== "object") return false;

    // accept empty objects
    if (!Object.keys(data).length) return true;

    for (const [key, value] of Object.entries(data)) {
      if (!keyPredicate(key)) {
        const error = `initial data key "${key}" does not match provided predicate`;
        console.error(error, {
          data,
          key,
          value,
        });
        throw Error(error);
      }

      if (!valuePredicate(value)) {
        const error = `initial data value for key ${key} does not match provided predicate`;
        console.error(error, {
          data,
          key,
          value,
        });
        throw Error(error);
      }
    }
    return true;
  }
  */
  cleanUp(): void {
    this.#private.observer.unsubscribe();
  }

  get(key: keyof S): iSubDocument<S[keyof S]> | undefined {
    return this.#private.subDocuments.get(key);
  }

  toArray(): iSubDocument<S[keyof S]>[] {
    return Array.from(this.#private.subDocuments.values());
  }

  protected handleChange({ newData }: FirestoreDocumentChangeData<S>) {
    if (!newData) console.warn(__filename, `newData was ${typeof newData}`);

    // update local data
    this.#private.data = newData;

    if (!newData) {
      // remove all sub documents
      return this.handleSubDocumentRemoval({} as S);
    }

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

  private handleSubDocumentAddition(newData: S) {
    for (const [_key, _value] of Object.entries(newData)) {
      const key = _key as keyof S;
      const data = _value as S[keyof S];
      // add missing sub document and stop (assuming there is only 1)
      if (!this.#private.subDocuments.has(key))
        return this.#private.subDocuments.set(
          key,
          new SubDocument({
            firestore: this.#private.firestore,
            data,
            key,
            parentDocumentPath: this.path,
            updateOnDataStorage: (newValue: S[keyof S]) =>
              this.subDocumentUpdater(key, newValue),
            deleteFromDataStorage: () => this.subDocumentRemover(key),
          })
        );
    }
  }

  private handleSubDocumentChange(newData: S): number {
    let affectedDocuments = 0;
    for (const [key, value] of Object.entries(newData)) {
      // update changed documents only
      const subDocument = this.#private.subDocuments.get(key as keyof S);

      if (!subDocument)
        throw Error(
          `Could not handleSubDocumentChange, document with key ${key} doesnt exist`
        );

      if (!objectsAreEqual(subDocument.data, value as S[keyof S])) {
        subDocument.data = value as S[keyof S];
        affectedDocuments++;
      }
    }
    return affectedDocuments;
  }

  private handleSubDocumentRemoval(newData: S) {
    for (const key of this.#private.subDocuments.keys()) {
      // remove extra sub document and stop (assuming there is only 1)
      if (!newData[key as keyof S])
        return this.#private.subDocuments.delete(key);
    }
  }

  private async subDocumentRemover(key: keyof S) {
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

  private async subDocumentUpdater<K extends keyof S>(key: K, newValue: S[K]) {
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

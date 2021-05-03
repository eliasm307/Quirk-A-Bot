import { iCompositeDocument, iSubDocument } from '../declarations/interfaces';
import {
  Firestore, FirestoreDocumentReference, FirestoreDocumentSnapshot,
} from '../FirebaseExports';
import valuesAreEqual from '../utils/valuesAreEqual';
import FirestoreDocumentObserver, {
  FirestoreDocumentChangeData, FirestoreDocumentObserverLoaderProps, FirestoreDocumentObserverProps,
} from './FirestoreDocumentObserver';
import SubDocument from './SubDocument';

type SubDocumentCreateDetails<S> = Record<keyof S, S[keyof S]>;

type SubDocumentDeleteDetails<S> = Record<keyof S, S[keyof S]>;

type SubDocumentUpdateDetails<S> = Record<
  keyof S,
  { before: S[keyof S]; after: S[keyof S] }
>;

interface SubDocumentChangeDetails<S> {
  /** Record of items that were created and their initial state on creation */
  creates?: SubDocumentCreateDetails<S>;
  /** Record of items that were deleted and their state before delete */
  deletes?: SubDocumentDeleteDetails<S>;
  /** Record of items that were updated and their state before and after the update */
  updates?: SubDocumentUpdateDetails<S>;
}

export interface AbstractCompositeDocumentLoaderProps<
  S extends Record<string, any>
> extends FirestoreDocumentObserverLoaderProps<S> {}

export interface AbstractCompositeDocumentProps<S extends Record<string, any>>
  extends AbstractCompositeDocumentLoaderProps<S> {
  initialData: S;
}

// todo break this into smaller pieces

// export interface FirestoreDocumentObserverProps<K extends string, V> {}

/** Firestore document change data including the detailed sub document change details */
interface CompositeDocumentChangeData<S>
  extends FirestoreDocumentChangeData<S> {
  changes: SubDocumentChangeDetails<S>;
}

export default abstract class AbstractCompositeDocument<
  SchemaType extends Record<string, any>
> implements iCompositeDocument<SchemaType> {
  readonly path: string;

  #private: {
    subDocuments: Map<
      keyof SchemaType,
      iSubDocument<SchemaType, keyof SchemaType>
    >;
    data: SchemaType;
    observer: FirestoreDocumentObserver<SchemaType>;
    documentRef: FirestoreDocumentReference;
    firestore: Firestore;
  };

  /*
  abstract load<C extends AbstractCompositeDocument<S>>(
    props: CompositeDocumentLoaderProps<S>
  ): C;
  */

  // todo only return instance when data is loaded initially from firestore
  protected constructor(props: AbstractCompositeDocumentProps<SchemaType>) {
    const { path, firestore, handleChange, initialData } = props;

    this.path = path;
    this.#private = {
      data: { ...initialData }, //
      firestore,
      documentRef: firestore.doc(path),
      subDocuments: new Map(),
      observer: new FirestoreDocumentObserver({
        ...props,
        handleChange: (newData) => {
          // handle change internally first
          this.handleChangeSnapshot(newData);
          // then use custom change handler
          handleChange(newData);
        },
      }),
    };

    // instantiate initial sub documents
    this.handleSubDocumentAddition(initialData);
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
        initialData,
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

  /** Delete sub document */
  async delete(key: keyof SchemaType): Promise<iCompositeDocument<SchemaType>> {
    /*
    const {
      [key]: excludedSubDocument,
      ...dataAfterDelete
    } = this.#private.data;
    */

    // overwrite without deleted sub document
    // await this.#private.documentRef.set(dataAfterDelete, { merge: false });

    // todo move to util
    if (!this.#private.data) {
      console.warn(
        __filename,
        `Could not delete sub-document with key ${key} at document path ${
          this.path
        } because overall data is ${typeof this.#private.data}`
      );
      return this;
    }

    if (!this.#private.data[key]) {
      console.warn(
        __filename,
        `Could not delete sub-document with key ${key} at document path ${
          this.path
        } because sub document data is ${typeof this.#private.data[
          key
        ]}, ie it doesnt exist`
      );
      return this;
    }

    const {
      [key]: excludedSubDocument,
      ...dataAfterDelete
    } = this.#private.data;

    /*
    const dataAfterDelete: any = { ...this.#private.data };
    delete dataAfterDelete[key];
    */

    /*
    console.warn(__filename, `Deleting key ${key}`, {
      key,
      dataBeforeDelete: this.#private.data,
      dataAfterDelete,
    });
    */

    try {
      await this.#private.firestore.doc(this.path).set(dataAfterDelete);
      this.handleSubDocumentRemoval(dataAfterDelete as SchemaType);
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
    return this;
  }

  get<K extends keyof SchemaType>(key: K): iSubDocument<SchemaType, K> {
    return (this.#private.subDocuments.get(key) ||
      this.newSubDocument(key, undefined)) as iSubDocument<SchemaType, K>;
  }

  async set<K extends keyof SchemaType>(
    key: K,
    newValue: SchemaType[K]
  ): Promise<iCompositeDocument<SchemaType>> {
    try {
      await this.#private.firestore
        .doc(this.path)
        .set({ [key]: newValue }, { merge: true });

      // update locally
      this.#private.data[key] = newValue;
    } catch (error) {
      console.error(__filename, `Error setting data to sub-document`, {
        key,
        parentDocumentPath: this.path,
      });
    }

    return this;
  }

  toArray(): iSubDocument<SchemaType, keyof SchemaType>[] {
    return Array.from(this.#private.subDocuments.values());
  }

  protected handleChangeSnapshot(
    props: FirestoreDocumentChangeData<SchemaType>
  ): CompositeDocumentChangeData<SchemaType> {
    // ? should this just overwrite existing data with new data?
    const { newData, oldData } = props;

    if (!newData) console.warn(__filename, `newData was ${typeof newData}`);

    // update local data
    this.#private.data = newData || ({} as SchemaType);

    if (!newData) {
      const deletes = this.handleSubDocumentRemoval({} as SchemaType);
      // remove all sub documents
      return { ...props, changes: { deletes } };
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
      affectedSubDocuments = this.handleSubDocumentChange(oldData, newData);
    }

    // just double check if assumption that multiple documents can be affected in a snapshot is true
    /*
    if (affectedSubDocuments > 1) {
      // ! yes multiple sub docs can be affected in a single snapshot

      console.error(
        __filename,
        `Multiple documents can be affected in a snapshot`,
        { newSubDocumentCount, existingSubDocumentCount, affectedSubDocuments }
      );

      throw Error(
        `Multiple documents can be affected in a snapshot, ${affectedSubDocuments} documents affected`
      );
    }
    */
  }

  private assertSubDocument<K extends keyof SchemaType>(
    key: K
  ): iSubDocument<SchemaType, K> {
    return (this.#private.subDocuments.get(key) ||
      this.newSubDocument(key, undefined)) as iSubDocument<SchemaType, K>;
  }

  private handleSubDocumentAddition(newData: SchemaType | undefined) {
    for (const [_key, _value] of Object.entries(newData || {})) {
      const key = _key as keyof SchemaType;
      const value = _value as SchemaType[typeof key];
      if (!this.#private.subDocuments.has(key)) this.newSubDocument(key, value);
    }
  }

  private handleSubDocumentChange(
    oldData: SchemaType | undefined,
    newData: SchemaType | undefined
  ): number {
    let affectedDocuments = 0;
    for (const [key, newValue] of Object.entries(newData || {})) {
      // update changed documents only
      // const subDocument = this.#private.subDocuments.get(key as keyof S);
      const oldValue = oldData && oldData[key];

      // todo delete?
      /*
      if (!oldValue) {
        const error = `Could not handleSubDocumentChange, sub document with key ${key} doesnt exist`;
        console.warn(__filename, error, { oldData, newData, key, newValue });
        throw Error(error);
      }
      */

      if (!valuesAreEqual(oldValue, newValue as SchemaType[keyof SchemaType])) {
        // ? is this required
        // subDocument.data = value as S[keyof S];

        // (this.#private.data as Record<string, any>)[key] = newValue;

        this.assertSubDocument(key).setDataLocallyOnly(newValue);

        affectedDocuments++;
      } else {
        console.log(
          __filename,
          `New data was the same as old data so no change made`,
          { key, oldValue, newValue }
        );
      }
    }
    return affectedDocuments;
  }

  private handleSubDocumentRemoval(
    newData: SchemaType
  ): SubDocumentDeleteDetails<SchemaType> {
    const deletes: SubDocumentDeleteDetails<SchemaType> = {} as SubDocumentDeleteDetails<SchemaType>;
    for (const key of this.#private.subDocuments.keys()) {
      // remove extra sub document
      if (!newData[key as keyof SchemaType]) {
        // ? will data be deleted already at this point? is there a point in getting the data
        // log state at delete
        const oldSubDocument = this.#private.data[key];
        if (oldSubDocument) deletes[key] = { ...oldSubDocument };

        // remove sub document
        this.#private.subDocuments.delete(key);
      }
    }
    return deletes;
  }

  /** Adds a new sub document if one does not exist, otherwise returns an existing instance */
  private newSubDocument<K extends keyof SchemaType>(
    key: K,
    value: SchemaType[K] | undefined
  ): iSubDocument<SchemaType, K> {
    const existingSubDocument = this.#private.subDocuments.get(key);

    // add missing sub document
    if (!existingSubDocument) {
      const subDocument = new SubDocument({
        firestore: this.#private.firestore,
        getDataFromStorage: () => this.#private.data && this.#private.data[key],
        key,
        parentDocumentPath: this.path,
        setOnDataStorage: (newValue: SchemaType[keyof SchemaType]) =>
          this.set(key, newValue),
        deleteFromDataStorage: () => this.delete(key),
      });

      this.#private.subDocuments.set(key, subDocument);

      return subDocument as iSubDocument<SchemaType, K>;
    }

    return existingSubDocument as iSubDocument<SchemaType, K>;
  }
}

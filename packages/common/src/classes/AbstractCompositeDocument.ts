import { iCompositeDocument, iSubDocument } from '../declarations/interfaces';
import {
  Firestore, FirestoreDocumentReference, FirestoreDocumentSnapshot,
} from '../FirebaseExports';
import valuesAreEqual from '../utils/valuesAreEqual';
import FirestoreDocumentObserver, {
  FirestoreDocumentChangeData, FirestoreDocumentObserverProps,
} from './FirestoreDocumentObserver';
import SubDocument from './SubDocument';

export type SubDocumentCreateDetails<S> = Record<keyof S, S[keyof S]>;

export type SubDocumentDeleteDetails<S> = Record<keyof S, S[keyof S]>;

/** For an update there must be a before and after state */
export type SubDocumentUpdateDetails<S> = Record<
  keyof S,
  { before: S[keyof S]; after: S[keyof S] }
>;

export interface SubDocumentChangeDetails<S> {
  /** Record of items that were created and their initial state on creation */
  creates?: SubDocumentCreateDetails<S>;
  /** Record of items that were deleted and their state before delete */
  deletes?: SubDocumentDeleteDetails<S>;
  /** Record of items that were updated and their state before and after the update */
  updates?: SubDocumentUpdateDetails<S>;
}

export interface AbstractCompositeDocumentLoaderProps<
  S extends Record<string, any>
> extends FirestoreDocumentObserverProps<S, CompositeDocumentChangeData<S>> {}

export interface AbstractCompositeDocumentProps<S extends Record<string, any>>
  extends AbstractCompositeDocumentLoaderProps<S> {}

// todo break this into smaller pieces

// export interface FirestoreDocumentObserverProps<K extends string, V> {}

/** Firestore document change data including the detailed sub document change details */
export interface CompositeDocumentChangeData<S>
  extends FirestoreDocumentChangeData<S> {
  changes: SubDocumentChangeDetails<S>;
}

export default abstract class AbstractCompositeDocument<
  SchemaType extends Record<string, any>
> implements iCompositeDocument<SchemaType>
{
  protected firestore: Firestore;
  protected observer: FirestoreDocumentObserver<SchemaType>;
  protected subDocuments: Map<
    keyof SchemaType,
    iSubDocument<SchemaType, keyof SchemaType>
  >;

  readonly path: string;

  data: SchemaType;
  documentRef: FirestoreDocumentReference;

  /*
  abstract load<C extends AbstractCompositeDocument<S>>(
    props: CompositeDocumentLoaderProps<S>
  ): C;
  */

  // todo only return instance when data is loaded initially from firestore
  protected constructor(props: AbstractCompositeDocumentProps<SchemaType>) {
    const { path, firestore, handleChange, initialData } = props;

    this.path = path;
    this.documentRef = firestore.doc(path);
    this.data = initialData ? { ...initialData } : ({} as SchemaType);
    this.firestore = firestore;
    this.subDocuments = new Map();
    this.observer = new FirestoreDocumentObserver({
      ...props,
      handleChange: (firestoreDocumentChangeData) => {
        // handle change internally first, and log detailed changes
        const compositeDocumentChangeData = this.handleChangeSnapshot(
          firestoreDocumentChangeData
        );
        // then use custom change handler
        handleChange(compositeDocumentChangeData);
      },
    });

    // instantiate initial sub documents
    this.handleSubDocumentAddition(initialData);
  }

  cleanUp(): void {
    this.observer.unsubscribe();
  }

  /** Delete sub document */
  async delete(key: keyof SchemaType): Promise<iCompositeDocument<SchemaType>> {
    // todo move to util
    if (!this.data) {
      console.warn(
        __filename,
        `Could not delete sub-document with key ${key} at document path ${
          this.path
        } because overall data is ${typeof this.data}`
      );
      return this;
    }

    if (!this.data[key]) {
      console.warn(
        __filename,
        `Could not delete sub-document with key ${key} at document path ${
          this.path
        } because sub document data is ${typeof this.data[
          key
        ]}, ie it doesn't exist`
      );
      return this;
    }

    const { [key]: excludedSubDocument, ...dataAfterDelete } = this.data;

    /*
    console.warn(__filename, `Deleting key ${key}`, {
      key,
      dataBeforeDelete: this.data,
      dataAfterDelete,
    });
    */

    try {
      await this.documentRef.set(dataAfterDelete);
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

  get(key: keyof SchemaType): iSubDocument<SchemaType, keyof SchemaType> {
    return this.subDocuments.get(key) || this.newSubDocument(key);
  }

  /** Set the value of a sub document, merges change into overall composite document */
  async set<K extends keyof SchemaType>(
    key: K,
    newValue: SchemaType[K] | undefined
  ): Promise<iCompositeDocument<SchemaType>> {
    try {
      await this.firestore
        .doc(this.path)
        .set({ [key]: newValue }, { merge: true });

      // update locally
      if (newValue) this.data[key] = newValue;
    } catch (error) {
      console.error(__filename, `Error setting data to sub-document`, {
        key,
        parentDocumentPath: this.path,
      });
    }

    return this;
  }

  toArray(): iSubDocument<SchemaType, keyof SchemaType>[] {
    return Array.from(this.subDocuments.values());
  }

  protected handleChangeSnapshot(
    props: FirestoreDocumentChangeData<SchemaType>
  ): CompositeDocumentChangeData<SchemaType> {
    // ? should this just overwrite existing data with new data?
    const { newData, oldData, snapshot } = props;

    // if (!newData) console.warn(__filename, `newData was ${typeof newData}`);

    // update local data
    this.data = newData ? { ...newData } : ({} as SchemaType);

    if (!newData) {
      // remove all sub documents
      const deletes = this.handleSubDocumentRemoval({} as SchemaType);
      return { ...props, changes: { deletes } };
    }

    const changes: SubDocumentChangeDetails<SchemaType> = {};

    const newSubDocumentCount = Object.keys(newData).length;

    const existingSubDocumentCount = this.subDocuments.size;

    // ! multiple sub docs can be affected in a single snapshot

    if (newSubDocumentCount > existingSubDocumentCount) {
      // sub documents added
      const creates = this.handleSubDocumentAddition(newData);
      changes.creates = creates;
    } else if (newSubDocumentCount < existingSubDocumentCount) {
      // sub documents removed
      const deletes = this.handleSubDocumentRemoval(newData);
      changes.deletes = deletes;
    } else if (newSubDocumentCount === existingSubDocumentCount && oldData) {
      // sub documents changed
      const updates = this.handleSubDocumentChange(oldData, newData);
      changes.updates = updates;
    } else {
      const error = `Unknown change type`;
      console.error(__filename, error, {
        changes,
        newData,
        oldData,
        id: snapshot.id,
        exists: snapshot.exists,
        newSubDocumentCount,
        existingSubDocumentCount,
      });

      throw Error(error);
    }

    console.log(__filename, `Detected snapshot changes`, {
      changes,
      newData,
      oldData,
      id: snapshot.id,
      exists: snapshot.exists,
      newSubDocumentCount,
      existingSubDocumentCount,
    });

    return { ...props, changes };
  }

  private assertSubDocument(
    key: keyof SchemaType
  ): iSubDocument<SchemaType, keyof SchemaType> {
    return this.subDocuments.get(key) || this.newSubDocument(key);
  }

  private handleSubDocumentAddition(
    newData: SchemaType | undefined
  ): SubDocumentCreateDetails<SchemaType> {
    const creates: SubDocumentCreateDetails<SchemaType> =
      {} as SubDocumentCreateDetails<SchemaType>;

    for (const [_key, _value] of Object.entries(newData || {})) {
      const key = _key as keyof SchemaType;
      const value = _value as SchemaType[typeof key];
      if (!this.subDocuments.has(key)) {
        this.newSubDocument(key);

        // log create
        creates[key] = { ...value };
      }
    }

    return creates;
  }

  private handleSubDocumentChange(
    oldData: SchemaType,
    newData: SchemaType
  ): SubDocumentUpdateDetails<SchemaType> {
    const updates: SubDocumentUpdateDetails<SchemaType> =
      {} as SubDocumentUpdateDetails<SchemaType>;

    for (const [_key, newValue] of Object.entries(newData || {})) {
      const key = _key as keyof SchemaType;

      const oldValue = oldData && oldData[key];

      // update changed documents only
      if (!valuesAreEqual(oldValue, newValue as SchemaType[keyof SchemaType])) {
        this.assertSubDocument(key).setDataLocallyOnly(newValue);

        // log update
        updates[key] = { after: newValue, before: oldValue };
      } else {
        console.log(
          __filename,
          `New data was the same as old data so no change made`,
          { key, oldValue, newValue }
        );
      }
    }
    return updates;
  }

  /** Handles when a snapshot says a sub document has been removed, this removes the sub document instance */
  private handleSubDocumentRemoval(
    newData: SchemaType
  ): SubDocumentDeleteDetails<SchemaType> {
    const deletes: SubDocumentDeleteDetails<SchemaType> =
      {} as SubDocumentDeleteDetails<SchemaType>;
    for (const key of this.subDocuments.keys()) {
      // remove extra sub document
      if (!newData[key as keyof SchemaType]) {
        // ? will data be deleted already at this point? is there a point in getting the data
        // log state before delete
        const oldSubDocument = this.subDocuments.get(key);
        if (oldSubDocument) {
          const oldData = oldSubDocument.data;

          // add data to log if defined
          if (oldData) {
            deletes[key] = { ...oldData };
          } else {
            console.warn(`oldData for document with key ${key} was falsy`, {
              oldSubDocument,
              oldData,
            });
          }
        } else {
          console.warn(
            `oldSubDocument for document with key ${key} was falsy`,
            {
              oldSubDocument,
            }
          );
        }

        // remove sub document
        this.subDocuments.delete(key);
      }
    }
    return deletes;
  }

  /** Instantiates a new sub document if one does not exist, otherwise returns an existing instance
   * `Note` Generic K is used to specify the possible types of initialValue
   */
  private newSubDocument(
    key: keyof SchemaType
  ): iSubDocument<SchemaType, keyof SchemaType> {
    const existingSubDocument = this.subDocuments.get(key);

    // return existing sub document
    if (existingSubDocument)
      return existingSubDocument as iSubDocument<SchemaType, keyof SchemaType>;

    // set initial value if defined // ! not the responsibility of this method
    // if (initialValue) await this.set(key, initialValue);

    const subDocument = new SubDocument({
      firestore: this.firestore,
      getDataFromStorage: () => this.data && this.data[key],
      key,
      parentDocumentPath: this.path,
      setOnDataStorage: (newValue: SchemaType[keyof SchemaType]) =>
        this.set(key, newValue),
      deleteFromDataStorage: () => this.delete(key),
    });

    this.subDocuments.set(key, subDocument);

    return subDocument;
  }
}

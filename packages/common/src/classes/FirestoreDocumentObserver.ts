import { Firestore, FirestoreDocumentSnapshot } from '../FirebaseExports';

export interface iFirestoreDocumentObserver {
  path: string;

  unsubscribe(): void;
}

export interface FirestoreDocumentChangeData<D> {
  /** Whether Firestore says the document exists */
  // exists: boolean;
  /** Firestore document id */
  // id: string;
  /** New data from this change */
  newData?: D;
  /** Old data from last change, can be undefined if document didn't exist but must not contain undefined fields */
  oldData?: D;
  /** Firestore path for document, can be undefined if document didn't exist but must not contain undefined fields */
  path: string;
  /** Raw Firestore document change snapshot */
  snapshot: FirestoreDocumentSnapshot;
  /** Time in milliseconds */
  time: number;
}

export interface FirestoreDocumentObserverProps<D> {
  /** Firestore instance to use */
  firestore: Firestore;
  /** Change handler function used to notify  */
  handleChange: (changeData: FirestoreDocumentChangeData<D>) => void;
  /** Initial internal data for the observer */
  initialData?: D;
  /** Firestore path for document, can be undefined if document didn't exist */
  path: string;
  /** Document schema validator, to allow the return data to be typed */
  schemaPredicate: (data: unknown) => data is D;
}

/** Listens to changes to a Firestore document and creates events if there are updates */
export default class FirestoreDocumentObserver<D>
  implements iFirestoreDocumentObserver
{
  protected unsubscriber: () => void;

  #data?: D;
  path: string;

  constructor({
    firestore,
    path,
    handleChange,
    schemaPredicate,
    initialData,
  }: FirestoreDocumentObserverProps<D>) {
    this.path = path;
    this.#data = initialData;

    // subscribe to firestore document
    this.unsubscriber = firestore.doc(path).onSnapshot(
      { includeMetadataChanges: false },
      {
        next: (snapshot) => {
          const newData = snapshot.data();

          console.log(__filename, `Internal change log`, {
            newData,
            oldData: this.#data,
            path,
            hasPendingWrites: snapshot.metadata.hasPendingWrites,
          });

          // ! includeMetadataChanges set to false so this shouldn't matter
          /*
          if (snapshot.metadata.hasPendingWrites) {
            // ignore local changes not yet committed to firestore
            // console.log('Modified document: ', { data });
            return;
          }
          */

          // ! always allow undefined values as these represent documents that don't exist
          if (typeof newData !== "undefined" && !schemaPredicate(newData)) {
            const error = `New data for document at path "${path}" doesn't meet required schema predicate`;
            console.error({ error, path: this.path, newData });
            throw Error(error);
          }

          const changeData: FirestoreDocumentChangeData<D> = {
            newData: newData && { ...newData },
            oldData: this.#data && { ...this.#data },
            path: this.path,
            time: new Date().getTime(),
            snapshot,
          };

          // update internal data
          this.#data = newData;

          // notify subscriber of change
          return handleChange(changeData);
        },
        error: console.error, // ? should this throw?
      }
    );
  }

  // todo delete
  // ! doesn't need load method as initial data is optional, this will be set when the listener is set anyway
  /*
  static   load<D>(
    props: FirestoreDocumentObserverLoaderProps<D>
  ):  FirestoreDocumentObserver<D>  {
    const { schemaPredicate , firestore, path , } = props;
/*
    const doc = await firestore.doc(path).get();

    const initialData = doc.data();
    */

  /*
    if (!schemaPredicate(initialData)) {
      const error = `Could not load document observer for document path "${path}", the initial data does not meet the provided predicate`;
      console.error({ error, path, initialData });

      return Promise.reject(Error(error));
    }

    // todo instead of returning a new instance each time, this should keep track of instances and reuse them if an instance at the same path is requested, documents at the same path should have the same predicates etc, maybe different firestore objects?
    return new FirestoreDocumentObserver({ ...props, initialData });
  }
  */

  /** Unsubscribe to Firestore document */
  unsubscribe(): void {
    try {
      this.unsubscriber();
    } catch (error) {
      console.error(__filename, `Could not unsubscribe to firestore document`, {
        path: this.path,
        error,
      });
    }
  }
}

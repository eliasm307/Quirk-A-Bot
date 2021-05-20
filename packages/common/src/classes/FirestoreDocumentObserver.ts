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

          // ! always allow undefined values as these represent documents that don't exist
          if (typeof newData !== "undefined" && !schemaPredicate(newData)) {
            const error = `New data for document at path "${path}" doesn't meet required schema predicate`;
            console.error({ error, path: this.path, newData });
            throw Error(error);
          }

          // update internal data
          this.#data = newData;

          // notify subscriber of change
          handleChange({
            newData: newData && { ...newData },
            oldData: this.#data && { ...this.#data },
            path: this.path,
            time: new Date().getTime(),
            snapshot,
          });
        },
        error: console.error, // ? should this throw?
      }
    );
  }

  /** Unsubscribe to Firestore document */
  unsubscribe(): void {
    this.unsubscriber();
  }
}

import { Firestore, FirestoreCollectionSnapshot } from '../FirebaseExports';

export interface iFirestoreCollectionObserver {
  path: string;

  unsubscribe(): void;
}

export interface FirestoreCollectionChangeData<D> {
  /** New data from this snapshot */
  newData: D[];
  /** Old data from last snapshot */
  oldData: D[];
  /** Firestore path for collection */
  path: string;
  /** Raw Firestore document change snapshot */
  snapshot: FirestoreCollectionSnapshot;
  /** Time in milliseconds */
  time: number;
}

export interface FirestoreCollectionObserverProps<D> {
  documentSchemaPredicate: (data: unknown) => data is D;
  /** Firestore instance to use */
  firestore: Firestore;
  /** Change handler function used to notify  */
  handleChange: (changeData: FirestoreCollectionChangeData<D>) => void;
  /** Initial internal data for the observer */
  initialData?: D[];
  /** Firestore path for Collection */
  path: string;
}

/** Listens to changes to a Firestore Collection and creates events if there are updates */
export default class FirestoreCollectionObserver<D>
  implements iFirestoreCollectionObserver
{
  protected unsubscriber: () => void;

  #data?: D[];
  path: string;

  constructor({
    firestore,
    path,
    handleChange,
    documentSchemaPredicate: schemaPredicate,
    initialData,
  }: FirestoreCollectionObserverProps<D>) {
    this.path = path;

    this.unsubscriber = firestore.collection(path).onSnapshot(
      { includeMetadataChanges: false },
      {
        next: (snapshot) => {
          const newData: D[] = [];

          // process document snapshots
          snapshot.forEach((docSnapshot) => {
            const newDocData = docSnapshot.data();
            const path = docSnapshot.ref.path;

            // ! always allow undefined values as these represent documents that don't exist
            if (
              typeof newDocData !== "undefined" &&
              !schemaPredicate(newDocData)
            ) {
              const error = `New data for document at path "${path}" doesn't meet required schema predicate`;
              console.error({ error, path, newDocData });
              throw Error(error);
            }
            newData.push(newDocData);
          });

          // update internal data
          this.#data = newData;

          // notify subscriber of change
          handleChange({
            path: this.path,
            snapshot,
            time: new Date().getTime(),
            newData,
            oldData: this.#data,
          });
        },
        error: console.error, // ? should this throw?
      }
    );
  }

  unsubscribe(): void {
    this.unsubscriber();
  }
}

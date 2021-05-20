import { Firestore } from '../FirebaseExports';

export interface iFirestoreCollectionObserver {
  path: string;

  unsubscribe(): void;
}

export interface FirestoreCollectionChangeData<D> {
  /** Firestore document id */
  id: string;
  /** New data from this change */
  newData?: D;
  /** Old data from last change, can be undefined if document didn't exist but must not contain undefined fields */
  oldData?: D;
  /** Firestore path for document, can be undefined if document didn't exist but must not contain undefined fields */
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

  path: string;

  constructor({
    firestore,
    path,
    handleChange,
    documentSchemaPredicate: schemaPredicate,
    initialData,
  }: FirestoreCollectionObserverProps<D>) {
    this.unsubscriber = firestore
      .collection(path)
      .onSnapshot({ next: (snapshot) => {}, error: console.error });
  }

  unsubscribe(): void {}
}

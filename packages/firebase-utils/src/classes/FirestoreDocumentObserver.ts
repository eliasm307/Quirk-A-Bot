import { Firestore } from '../FirebaseExports';

export interface iFirestoreDocumentObserver {
  unsubscribe(): void;
}
export interface FirestoreDocumentObserverProps<D> {
  dataPredicate: (data: any) => data is D;
  firestore: Firestore;
  handleChange: (newData: D) => void;
  path: string;
}

export default class FirestoreDocumentObserver<D>
  implements iFirestoreDocumentObserver {
  protected unsub: () => void;

  constructor({
    firestore,
    path,
    dataPredicate,
    handleChange,
  }: FirestoreDocumentObserverProps<D>) {
    this.unsub = firestore.doc(path).onSnapshot({
      next: (snapshot) => {
        if (!snapshot.exists) {
          // console.log('snapshot does not exist, was this document deleted?', data);
          return;
        }

        if (snapshot.metadata.hasPendingWrites) {
          // ignore local changes not yet commited to firestore
          // console.log('Modified document: ', { data });
          return;
        }

        const data: any = snapshot.data();

        if (!dataPredicate(data))
          throw Error(
            `Data from document at path ${path} did not match the provided dataPredicate`
          );

        // remote change
        handleChange(data);
      },
      error: console.error,
    });
  }

  /** Unsubscribe to Firestore document */
  unsubscribe(): void {
    try {
      this.unsub();
    } catch (error: any) {
      console.error(__filename, `Could not unsubscribe to firestore document`, {
        error,
      });
    }
  }
}

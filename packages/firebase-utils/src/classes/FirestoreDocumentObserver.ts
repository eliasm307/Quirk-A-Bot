import { Firestore } from '../FirebaseExports';

export interface iFirestoreDocumentObserver {
  path: string;

  unsubscribe(): void;
}
export interface FirestoreDocumentObserverProps<K extends string, V> {
  firestore: Firestore;
  handleChange: (newData: GenericObject<K, V>) => void;
  keyPredicate: (key: any) => key is K;
  path: string;
  valuePredicate: (value: any) => value is K;
}

// todo move tomore general location
export type GenericObject<K extends string, V> = {
  [key in K]: V;
};

export default class FirestoreDocumentObserver<K extends string, V>
  implements iFirestoreDocumentObserver {
  private keyPredicate: (key: any) => key is K;
  private valuePredicate: (value: any) => value is K;

  protected unsub: () => void;

  path: string;

  constructor({
    firestore,
    path,
    keyPredicate,
    valuePredicate,
    handleChange,
  }: FirestoreDocumentObserverProps<K, V>) {
    this.path = path;
    this.keyPredicate = keyPredicate;
    this.valuePredicate = valuePredicate;

    // subscribe to firestore document
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

        if (!this.documentDataSchemaIsValid(data))
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

  private documentDataSchemaIsValid(data: any): data is GenericObject<K, V> {
    if (typeof data !== "object") return false;

    if (!Object.keys(data).length) return true; // accept empty objects

    // check each key value
    for (const [key, value] of Object.entries(data)) {
      if (!this.keyPredicate(key)) {
        const error = `Key ${key} from a firestore document at path ${this.path} did not satisfy the provided predicate`;
        console.error({ error, path: this.path, data, badKey: key, value });
        throw Error(error);
      }
      if (!this.valuePredicate(value)) {
        const error = `Value ${value} from a firestore document at path ${this.path} did not satisfy the provided predicate`;
        console.error({ error, path: this.path, data, key, badValue: value });
        throw Error(error);
      }
    }

    // if no errors thrown then schema is valid
    return true;
  }
}

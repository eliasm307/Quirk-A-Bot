import { Observable } from 'rxjs';

import { firestore } from '@quirk-a-bot/common';

interface Props<D> {
  collectionPath: string;

  dataPredicate(value: unknown): value is D;
}

// todo test

export default function getFirestoreCollectionChangeObservable<D>({
  collectionPath,
  dataPredicate,
}: Props<D>): Observable<D[]> {
  return new Observable((observer) => {
    const ref = firestore.collection(collectionPath);

    // return unsubscriber
    return ref.onSnapshot({
      complete: observer.complete,
      error: observer.error,
      next: (querySnapshot) => {
        const data = querySnapshot.docs
          .filter((docSnapshot) => docSnapshot.exists)
          .map((docSnapshot) => {
            const docData = docSnapshot.data();
            return dataPredicate(docData) && docData;
          })
          .filter(Boolean)
          .map((docData) => docData as D);

        observer.next(data);
      },
    });
  });
}

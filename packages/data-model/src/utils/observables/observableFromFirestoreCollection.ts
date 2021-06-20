import { Observable } from 'rxjs';

import { FirestoreCollectionReference, FirestoreQuery } from '@quirk-a-bot/common';

interface Props<D> {
  firestoreCollectionRef: FirestoreQuery | FirestoreCollectionReference;

  dataPredicate(value: unknown): value is D;
}

// todo test

export default function observableFromFirestoreCollection<D>({
  dataPredicate,
  firestoreCollectionRef,
}: Props<D>): Observable<D[]> {
  return new Observable((observer) => {
    // const ref = firestore.collection(collectionPath);

    // return unsubscriber
    return firestoreCollectionRef.onSnapshot({
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

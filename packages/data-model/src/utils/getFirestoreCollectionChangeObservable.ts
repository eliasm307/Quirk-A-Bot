import { Observable } from 'rxjs';

import { firestore } from '@quirk-a-bot/common';

interface Props<D> {
  collectionPath: string;

  dataPredicate(value: unknown): value is D;
}
export default function getFirestoreCollectionChangeObservable<D>({
  collectionPath,
  dataPredicate,
}: Props<D>): Observable<D | undefined> {
  return new Observable((observer) => {
    const ref = firestore.collection(collectionPath);
    return ref.onSnapshot({
      complete: observer.complete,
      error: observer.error,
      next: (querySnapshot) => {
        const data = querySnapshot.docs
          .filter((docSnapshot) => docSnapshot.exists)
          .map((docSnapshot) => docSnapshot.data())
          .filter((docData) => dataPredicate(docData));

        const goodData = data.filter((docData) => dataPredicate(docData));
      },
    });
  });
}

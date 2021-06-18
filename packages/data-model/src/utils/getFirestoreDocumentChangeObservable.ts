import { Observable } from 'rxjs';

import { firestore } from '@quirk-a-bot/common';

interface Props<D> {
  documentPath: string;

  dataPredicate(value: unknown): value is D;
}

// todo test

export default function getFirestoreDocumentChangeObservable<D>({
  documentPath,
  dataPredicate: schemaPredicate,
}: Props<D>): Observable<D | undefined> {
  return new Observable((observer) => {
    const ref = firestore.doc(documentPath);

    // send an initial undefined value if document doesn't exist
    void ref
      .get()
      .then((snapshot) => {
        // eslint-disable-next-line promise/always-return
        if (!snapshot.exists) observer.next(undefined);

        // ? should initial data be sent from here?
      })
      .catch(observer.error);

    // return unsubscribe function
    return ref.onSnapshot({
      complete: observer.complete,
      error: observer.error,
      next: (snapshot) => {
        const newData = snapshot.data();

        console.warn(`initial snapshot for document path "${documentPath}"`, {
          newData,
          documentExists: snapshot.exists,
        });

        // ? undefined represents a document that doesn't exist
        if (newData === undefined || !snapshot.exists)
          return observer.next(undefined);

        if (!schemaPredicate(newData)) {
          const error = `New data from document at path "${documentPath}" doesn't meet required schema predicate`;
          console.error({
            error,
            documentPath,
            newData,
          });
          throw Error(error);
        }

        observer.next(newData);
      },
    });
  });
}

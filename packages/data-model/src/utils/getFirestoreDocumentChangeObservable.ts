import { Observable, Subject } from 'rxjs';

import { firestore } from '@quirk-a-bot/common';

import {
  iCharacterSheetData,
} from '../classes/character-sheet/interfaces/character-sheet-interfaces';
import { isCharacterSheetData } from './type-predicates';

export default function getFirestoreDocumentChangeObservable(
  documentPath: string
): Observable<iCharacterSheetData | undefined> {
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

        if (!isCharacterSheetData(newData)) {
          const error = `New data from document at path "${documentPath}" doesn't meet required schema predicate`;
          console.error({
            error,
            compositeDocumentPath: documentPath,
            newData,
          });
          throw Error(error);
        }

        observer.next(newData);
      },
    });
  });
}

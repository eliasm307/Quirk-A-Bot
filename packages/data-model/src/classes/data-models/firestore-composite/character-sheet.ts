import { from, Observable, of, Subject, timer } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, switchMap, tap } from 'rxjs/operators';

import { firestore, FirestoreDocumentReference, iHasParentPath } from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import { isCharacterSheetData } from '../../../utils/type-predicates';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { createPath } from '../../data-storage/utils/createPath';
import { BaseModel } from '../interfaces/interfaces';

interface Props extends iHasId, iHasParentPath {}

export default class CharacterSheetFirestoreCompositeModel
  implements BaseModel<iCharacterSheetData>
{
  #firestoreDocumentRef: FirestoreDocumentReference;
  /** Incoming changes */
  #incomingUpdatesSubject: Subject<iCharacterSheetData>;
  #outgoingUpdatesSubject: Subject<iCharacterSheetData | undefined>;
  #unsubscribers: (() => void)[] = [];
  /** Outgoing changes to observers of this instance */
  changes: Observable<iCharacterSheetData | undefined>;
  id: string;
  path: string;

  constructor(props: Props) {
    const { id, parentPath } = props;

    this.id = id;

    // todo assert id and parentPath are valid

    // todo this should come from firestore composite utils which are used by all firestore composite data models
    this.path = createPath(parentPath, id);

    this.#incomingUpdatesSubject = new Subject<iCharacterSheetData>();

    // handle external change events internally
    this.#incomingUpdatesSubject
      .pipe(
        switchMap((newData: iCharacterSheetData) =>
          from(this.#firestoreDocumentRef.set(newData)).pipe(
            tap(() => {
              console.warn("Data updated successfully", { newData });
              this.#outgoingUpdatesSubject.next(newData);
            })
          )
        ),
        retryWhen((errors) =>
          errors.pipe(
            // log error message
            tap((val) =>
              console.error(`Error updating character sheet, retrying...`, {
                val,
              })
            ),
            // restart in 1 seconds
            delayWhen(() => timer(1000))
          )
        ),
        catchError((error) => {
          console.error(`update failed for character sheet "${this.path}"`, {
            error,
          });
          return of(error);
        })
      )
      .subscribe({
        error: console.error,
        complete: () =>
          console.warn(`Observer completed but this should never complete`),
        next: (error: any) => {
          if (error) console.error(`Update failed2`, { error });
        },
      });

    const { outgoingUpdatesSubject, ref, firestoreDocumentUnsubscribe } =
      this.getCharacterSheetTraitsDocumentChangeSubject(this.path);

    this.#firestoreDocumentRef = ref;
    this.#unsubscribers.push(firestoreDocumentUnsubscribe);

    this.#outgoingUpdatesSubject = outgoingUpdatesSubject;
    this.changes = outgoingUpdatesSubject.asObservable();
  }

  /** Releases any resources */
  dispose() {
    console.log(`Dispose for path ${this.path}`);
    this.#unsubscribers.forEach((unsubscribe) => unsubscribe());
  }

  getCharacterSheetTraitsDocumentChangeSubject(compositeDocumentPath: string): {
    outgoingUpdatesSubject: Subject<iCharacterSheetData | undefined>;
    firestoreDocumentUnsubscribe: () => void;
    ref: FirestoreDocumentReference;
  } {
    const outgoingUpdatesSubject = new Subject<
      iCharacterSheetData | undefined
    >();

    /*
    const compositeDocumentsCollectionPath = createPath(
      characterSheetPath,
      CHARACTER_SHEET_TRAIT_COMPOSITE_DOCUMENT_COLLECTION_NAME
    );
    const compositeDocumentPath = createPath(
      compositeDocumentsCollectionPath,
      ALL_TRAITS_COLLECTION_NAME
    );
    */

    const ref = firestore.doc(compositeDocumentPath);

    const firestoreDocumentUnsubscribe = ref.onSnapshot({
      complete: outgoingUpdatesSubject.complete,
      error: outgoingUpdatesSubject.error,
      next: (snapshot) => {
        const newData = snapshot.data();

        // ? undefined represents a document that doesn't exist
        if (newData === undefined)
          return outgoingUpdatesSubject.next(undefined);

        if (!isCharacterSheetData(newData)) {
          const error = `New data from document at path "${compositeDocumentPath}" doesn't meet required schema predicate`;
          console.error({ error, compositeDocumentPath, newData });
          throw Error(error);
        }

        outgoingUpdatesSubject.next(newData);
      },
    });

    return { outgoingUpdatesSubject, firestoreDocumentUnsubscribe, ref };
  }

  update(updatedData: Omit<iCharacterSheetData, "id">): void {
    this.#incomingUpdatesSubject.next({ ...updatedData, id: this.id });
  }
}

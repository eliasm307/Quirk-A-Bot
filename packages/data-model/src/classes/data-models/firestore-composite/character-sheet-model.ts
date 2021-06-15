import { from, Observable, of, Subject, timer } from 'rxjs';
import {
  catchError, delayWhen, filter, map, retryWhen, scan, switchMap, tap,
} from 'rxjs/operators';

import {
  firestore, FirestoreDocumentReference, iHasParentPath, valuesAreEqual,
} from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import { isCharacterSheetData } from '../../../utils/type-predicates';
import {
  iCharacterSheetDataOLD,
} from '../../character-sheet/interfaces/character-sheet-interfaces';
import { createPath } from '../../data-storage/utils/createPath';
import { CharacterSheetModel } from '../interfaces/interfaces';

interface Props extends iHasId, iHasParentPath {}

export default class CharacterSheetFirestoreCompositeModel
  implements CharacterSheetModel
{
  #firestoreDocumentRef: FirestoreDocumentReference;
  /** Incoming changes */
  #incomingUpdatesSubject: Subject<iCharacterSheetDataOLD>;
  #outgoingUpdatesSubject: Subject<iCharacterSheetDataOLD | undefined>;
  #unsubscribers: (() => void)[] = [];
  /** Outgoing changes to observers of this instance */
  changes: Observable<iCharacterSheetDataOLD | undefined>;
  id: string;
  path: string;

  constructor(props: Props) {
    const { id, parentPath } = props;

    this.id = id;

    // todo assert id and parentPath are valid

    // todo this should come from firestore composite utils which are used by all firestore composite data models
    this.path = createPath(parentPath, id);

    this.#incomingUpdatesSubject = new Subject<iCharacterSheetDataOLD>();

    // handle external change events internally
    const incomingUpdatesSubscription = this.#incomingUpdatesSubject
      .pipe(
        switchMap((newData: iCharacterSheetDataOLD) =>
          from(this.#firestoreDocumentRef.set(newData)).pipe(
            tap(() => {
              // console.warn("Data updated successfully", { newData });
              // apply local update immediately
              this.#outgoingUpdatesSubject.next(newData);
            })
          )
        ),
        /*
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
        */
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

    this.#unsubscribers.push(() => incomingUpdatesSubscription.unsubscribe());

    const { outgoingUpdatesSubject, ref } =
      this.getCharacterSheetTraitsDocumentChangeSubject(this.path);

    this.#firestoreDocumentRef = ref;

    this.#outgoingUpdatesSubject = outgoingUpdatesSubject;
    this.changes = outgoingUpdatesSubject.asObservable().pipe(
      scan(
        ({ data: lastData }, data) => ({
          data,
          hasChanges: !valuesAreEqual(lastData, data),
        }),
        {} as { data: iCharacterSheetDataOLD | undefined; hasChanges: boolean }
      ),
      filter(({ hasChanges }) => {
        // if (!hasChanges) console.warn(`Ignoring change`);
        return hasChanges;
      }),
      map(({ data }) => data)
    );
  }

  /** Releases any resources */
  dispose() {
    console.log(`Dispose for path ${this.path}`);
    this.#unsubscribers.forEach((unsubscribe) => unsubscribe());
  }

  update(updatedData: Omit<iCharacterSheetDataOLD, "id">): void {
    this.#incomingUpdatesSubject.next({ ...updatedData, id: this.id });
  }

  private getCharacterSheetTraitsDocumentChangeSubject(
    compositeDocumentPath: string
  ): {
    outgoingUpdatesSubject: Subject<iCharacterSheetDataOLD | undefined>;
    ref: FirestoreDocumentReference;
  } {
    const outgoingUpdatesSubject = new Subject<
      iCharacterSheetDataOLD | undefined
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

    // if document doesn't exist then send this status
    void ref
      .get()
      .then((snapshot) => {
        // eslint-disable-next-line promise/always-return
        if (!snapshot.exists) outgoingUpdatesSubject.next(undefined);

        // ? should initial data be sent from here?
      })
      .then(() => {
        const firestoreDocumentUnsubscribe = ref.onSnapshot({
          complete: outgoingUpdatesSubject.complete,
          error: outgoingUpdatesSubject.error,
          next: (snapshot) => {
            const newData = snapshot.data();

            console.warn(`initial snapshot for ${this.path}`, {
              newData,
              documentExists: snapshot.exists,
            });

            // ? undefined represents a document that doesn't exist
            if (newData === undefined || !snapshot.exists)
              return outgoingUpdatesSubject.next(undefined);

            if (!isCharacterSheetData(newData)) {
              const error = `New data from document at path "${compositeDocumentPath}" doesn't meet required schema predicate`;
              console.error({ error, compositeDocumentPath, newData });
              throw Error(error);
            }

            outgoingUpdatesSubject.next(newData);
          },
        });

        this.#unsubscribers.push(firestoreDocumentUnsubscribe);
        return undefined;
      });

    return { outgoingUpdatesSubject, ref };
  }
}

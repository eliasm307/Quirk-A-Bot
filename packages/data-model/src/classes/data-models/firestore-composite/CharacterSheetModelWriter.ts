import { from, of, Subject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { firestore, FirestoreDocumentReference, iHasParentPath } from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { createPath } from '../../data-storage/utils/createPath';
import { BaseModelWriter } from '../interfaces/interfaces';

interface Props extends iHasId, iHasParentPath {}

export default class CharacterSheetFirestoreCompositeModelWriter
  implements BaseModelWriter<iCharacterSheetData>
{
  #firestoreDocumentRef: FirestoreDocumentReference;
  /** Incoming changes */
  #incomingUpdatesSubject: Subject<iCharacterSheetData>;
  #unsubscribers: (() => void)[] = [];
  id: string;
  path: string;

  constructor(props: Props) {
    const { id, parentPath } = props;

    this.id = id;

    // todo createPath should come from firestore composite utils which are used by all firestore composite data models
    this.path = createPath(parentPath, id);

    this.#firestoreDocumentRef = firestore.doc(this.path);

    // todo assert id and parentPath are valid

    this.#incomingUpdatesSubject = new Subject<iCharacterSheetData>();

    // handle external change events internally
    const incomingUpdatesSubscription = this.#incomingUpdatesSubject
      .pipe(
        switchMap(
          (newData: iCharacterSheetData) =>
            // ? should this be set or update?
            from(this.#firestoreDocumentRef.set(newData))
          /* .pipe(
            tap(() => {
              // console.warn("Data updated successfully", { newData });
              // apply local update immediately
              this.#outgoingUpdatesSubject.next(newData);
            })
          )
          */
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
  }

  /** Releases any resources */
  dispose() {
    console.log(`Dispose for path ${this.path}`);
    this.#unsubscribers.forEach((unsubscribe) => unsubscribe());
  }

  update(updatedData: Omit<iCharacterSheetData, "id">): void {
    this.#incomingUpdatesSubject.next({ ...updatedData, id: this.id });
  }
}

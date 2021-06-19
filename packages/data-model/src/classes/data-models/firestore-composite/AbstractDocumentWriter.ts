import { from, of, Subject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { firestore, FirestoreDocumentReference, iHasParentPath } from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import { createPath } from '../../data-storage/utils/createPath';
import { BaseModelWriter } from '../interfaces/interfaces';

interface Props extends iHasId, iHasParentPath {}

export default abstract class AbstractDocumentWriter<D extends iHasId>
  implements BaseModelWriter<D>
{
  protected firestoreDocumentRef: FirestoreDocumentReference;

  /** Incoming changes */
  #incomingUpdatesSubject: Subject<D>;
  #unsubscribers: (() => void)[] = [];
  id: string;
  path: string;

  constructor(props: Props) {
    const { id, parentPath } = props;

    this.id = id;

    // todo createPath should come from firestore composite utils which are used by all firestore composite data models
    this.path = createPath(parentPath, id);

    this.firestoreDocumentRef = firestore.doc(this.path);

    // todo assert id and parentPath are valid

    this.#incomingUpdatesSubject = new Subject<D>();

    // handle external change events internally
    const incomingUpdatesSubscription = this.#incomingUpdatesSubject
      .pipe(
        switchMap(
          (newData: D) =>
            // ? should this be set or update?
            from(this.firestoreDocumentRef.update(newData))
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
          console.error(
            `update failed for firestore document at path "${this.path}"`,
            {
              error,
            }
          );
          return of(error);
        })
      )
      .subscribe({
        error: console.error,
        complete: () =>
          console.warn(`Observer completed but this should never complete`),
        next: (error: any) => {
          if (error) console.error(`Update failed`, { error, path: this.path });
        },
      });

    this.addUnsubscriber(() => incomingUpdatesSubscription.unsubscribe());
  }

  /** Releases any resources */
  dispose() {
    console.log(`Dispose for path ${this.path}`);
    this.#unsubscribers.forEach((unsubscribe) => unsubscribe());
  }

  update(updatedData: Omit<Partial<D>, "id">): void {
    this.#incomingUpdatesSubject.next({ ...updatedData, id: this.id } as D);
  }

  /** Adds a tear down function to be called when this instance is disposed */
  protected addUnsubscriber(unsubscriber: () => void) {
    this.#unsubscribers.push(unsubscriber);
  }
}

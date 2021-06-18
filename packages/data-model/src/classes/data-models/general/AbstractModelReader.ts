import { Observable, Observer, Subject } from 'rxjs';
import { filter, map, scan } from 'rxjs/operators';

import {
  firestore, FirestoreDocumentReference, iHasParentPath, valuesAreEqual,
} from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import getFirestoreDocumentChangeObservable from '../../../utils/getFirestoreDocumentChangeObservable';
import { isCharacterSheetData } from '../../../utils/type-predicates';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { createPath } from '../../data-storage/utils/createPath';
import { BaseModelReader } from '../interfaces/interfaces';

interface Props<D> extends iHasId, iHasParentPath {
  dataPredicate(value: unknown): value is D;
}

export default abstract class AbstractModelReader<D>
  implements BaseModelReader<D>
{
  // #firestoreDocumentRef: FirestoreDocumentReference;
  #unsubscribers: (() => void)[] = [];
  /** Outgoing changes to observers of this instance */
  changes: Observable<D | undefined>;
  id: string;
  path: string;

  constructor(props: Props<D>) {
    const { id, parentPath, dataPredicate } = props;

    this.id = id;

    // todo assert id and parentPath are valid

    // todo this should come from firestore composite utils which are used by all firestore composite data models
    this.path = createPath(parentPath, id);

    const outgoingUpdate$ = getFirestoreDocumentChangeObservable({
      documentPath: this.path,
      dataPredicate,
    });

    this.changes = outgoingUpdate$.pipe(
      scan(
        ({ data: lastData }, data) => ({
          data,
          hasChanges: !valuesAreEqual(lastData, data),
        }),
        {} as { data: D | undefined; hasChanges: boolean }
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

  /** Adds a tear down function to be called when this instance is disposed */
  protected addUnsubscriber(unsubscriber: () => void) {
    this.#unsubscribers.push(unsubscriber);
  }
}

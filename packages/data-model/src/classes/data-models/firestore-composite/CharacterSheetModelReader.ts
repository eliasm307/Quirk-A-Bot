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

interface Props extends iHasId, iHasParentPath {}

export default class CharacterSheetFirestoreCompositeModelReader
  implements BaseModelReader<iCharacterSheetData>
{
  // #firestoreDocumentRef: FirestoreDocumentReference;
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

    const outgoingUpdatesSubject = getFirestoreDocumentChangeObservable(
      this.path
    );

    this.changes = outgoingUpdatesSubject.pipe(
      scan(
        ({ data: lastData }, data) => ({
          data,
          hasChanges: !valuesAreEqual(lastData, data),
        }),
        {} as { data: iCharacterSheetData | undefined; hasChanges: boolean }
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
}

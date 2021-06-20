import { Observable } from 'rxjs';
import { filter, map, scan } from 'rxjs/operators';

import { iHasParentPath, valuesAreEqual } from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import observableFromFirestoreDocument from '../../../utils/observables/observableFromFirestoreDocument';
import { createPath } from '../../data-storage/utils/createPath';
import { BaseModelReader } from '../interfaces';

interface Props<D> extends iHasId, iHasParentPath {
  dataPredicate(value: unknown): value is D;
}

export default abstract class AbstractDocumentReader<D extends iHasId>
  implements BaseModelReader<D>
{
  // #firestoreDocumentRef: FirestoreDocumentReference;
  #unsubscribers: (() => void)[] = [];
  /** Outgoing changes to observers of this instance */
  data$: Observable<D | undefined>;
  id: string;
  path: string;

  constructor(props: Props<D>) {
    const { id, parentPath, dataPredicate } = props;

    this.id = id;

    // todo assert id and parentPath are valid

    // todo this should come from firestore composite utils which are used by all firestore composite data models
    this.path = createPath(parentPath, id);

    const outgoingUpdate$ = observableFromFirestoreDocument({
      documentPath: this.path,
      dataPredicate,
    });

    this.data$ = outgoingUpdate$.pipe(
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

import { Observable, Subject } from "rxjs";

import {
  CHARACTER_SHEET_TRAIT_COMPOSITE_DOCUMENT_COLLECTION_NAME,
  firestore,
  iHasParentPath,
  isRecord,
  TraitCollectionNameUnion,
  TraitNameUnion,
  TraitNameUnionOrString,
  TraitTypeNameUnion,
  TraitValueTypeUnion,
  UID,
} from "@quirk-a-bot/common";

import { iHasId } from "../../../declarations/interfaces";
import { iCharacterSheetData } from "../../character-sheet/interfaces/character-sheet-interfaces";
import { createPath } from "../../data-storage-OLD/utils/createPath";
import { BaseModel } from "../interfaces/interfaces";

interface Props extends iHasId, iHasParentPath {}

interface GetTraitCollectionChangeObserverProps<
  K extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion
> {
  characterSheetPath: string;
  keyPredicate: (key: unknown) => key is K;
  traitCollectionName: TraitCollectionNameUnion;
  valuePredicate: (value: unknown) => value is V;
}

const getTraitCollectionChangeObserver = <
  K extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion
>({
  characterSheetPath,
  traitCollectionName,
  keyPredicate,
  valuePredicate,
}: GetTraitCollectionChangeObserverProps<K, V>): Observable<Record<K, V>> => {
  return new Observable((observer) => {
    const compositeDocumentsCollectionPath = createPath(
      characterSheetPath,
      CHARACTER_SHEET_TRAIT_COMPOSITE_DOCUMENT_COLLECTION_NAME
    );
    const compositeDocumentPath = createPath(
      compositeDocumentsCollectionPath,
      traitCollectionName
    );

    firestore.doc(compositeDocumentPath).onSnapshot({
      complete: observer.complete,
      error: observer.error,
      next: (snapshot) => {
        const newData = snapshot.data();

        // schema predicate for a consistent composite tests if keys and values match a given predicate
        const documentSchemaPredicate = (data: unknown): data is Record<K, V> =>
          isRecord(data, keyPredicate, valuePredicate);

        // ! always allow undefined values as these represent documents that don't exist
        if (
          typeof newData !== "undefined" &&
          !documentSchemaPredicate(newData)
        ) {
          const error = `New data from document at path "${compositeDocumentPath}" doesn't meet required schema predicate`;
          console.error({ error, compositeDocumentPath, newData });
          throw Error(error);
        }

        observer.next(newData);
      },
    });
  });
};

export default class CharacterSheetFirestoreCompositeModel
  implements BaseModel<iCharacterSheetData>
{
  /** Incoming changes */
  #subject: Subject<iCharacterSheetData>;
  /** Outgoing changes to observers of this instance */
  changes: Observable<iCharacterSheetData>;

  constructor(props: Props) {
    const { id, parentPath } = props;

    // todo assert id and parentPath are valid

    this.changes = new Observable<iCharacterSheetData>((observer) => {});
  }

  update(updates: Partial<Omit<iCharacterSheetData, "id">>): void {}
}

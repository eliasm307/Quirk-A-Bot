import { from, Observable, of, Subject, timer } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, tap } from 'rxjs/operators';

import {
  ALL_TRAITS_COLLECTION_NAME, CHARACTER_SHEET_TRAIT_COMPOSITE_DOCUMENT_COLLECTION_NAME, firestore,
  FirestoreDocumentReference, iHasParentPath,
} from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import { isCharacterSheetData } from '../../../utils/type-predicates';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { createPath } from '../../data-storage-OLD/utils/createPath';
import { BaseModel } from '../interfaces/interfaces';

interface Props extends iHasId, iHasParentPath {}

/*
interface GetTraitCollectionChangeObserverProps<
  K extends TraitNameUnionOrString,
  V extends iBaseTraitData<TraitNameUnionOrString, TraitValueTypeUnion>
> {
  characterSheetPath: string;
  keyPredicate: (key: unknown) => key is K;
  traitCollectionName: TraitCollectionNameUnion;
  valuePredicate: (value: unknown) => value is V;
}

const getTraitCollectionDocumentChangeObserver = <
  K extends TraitNameUnionOrString,
  V extends iBaseTraitData<TraitNameUnionOrString, TraitValueTypeUnion>
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

    const unsubscribe = firestore.doc(compositeDocumentPath).onSnapshot({
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

    return { unsubscribe };
  });
};
*/

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
        map((newData) =>
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

    /*
    const commonObservableProps = {
      characterSheetPath: this.path,
      valuePredicate: isTraitData,
    };

    const coreStringTraitsObservable = getTraitCollectionDocumentChangeObserver<
      CoreStringTraitName,
      iCoreStringTraitData
    >({
      ...commonObservableProps,
      traitCollectionName: CORE_TRAIT_COLLECTION_NAME,
      keyPredicate: isCoreStringTraitName,
    });

    const coreNumberTraitsObservable = getTraitCollectionDocumentChangeObserver<
      CoreNumberTraitName,
      iCoreNumberTraitData
    >({
      ...commonObservableProps,
      traitCollectionName: CORE_TRAIT_COLLECTION_NAME,
      keyPredicate: isCoreNumberTraitName,
    });

    const attributesObservable = getTraitCollectionDocumentChangeObserver<
      AttributeName,
      iAttributeData
    >({
      ...commonObservableProps,
      traitCollectionName: ATTRIBUTE_COLLECTION_NAME,
      keyPredicate: isAttributeName,
    });

    const skillsObservable = getTraitCollectionDocumentChangeObserver<
      SkillName,
      iSkillData
    >({
      ...commonObservableProps,
      traitCollectionName: SKILL_COLLECTION_NAME,
      keyPredicate: isSkillName,
    });

    const disciplinesObservable = getTraitCollectionDocumentChangeObserver<
      DisciplineName,
      iDisciplineData
    >({
      ...commonObservableProps,
      traitCollectionName: DISCIPLINE_COLLECTION_NAME,
      keyPredicate: isDisciplineName,
    });

    const touchstoneOrConvictionObservable =
      getTraitCollectionDocumentChangeObserver<
        string,
        iTouchStoneOrConvictionData
      >({
        ...commonObservableProps,
        traitCollectionName: TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME,
        keyPredicate: isNonEmptyString,
      });
      */
    /* combineLatest([
      coreStringTraitsObservable,
      coreNumberTraitsObservable,
      touchstoneOrConvictionObservable,
      disciplinesObservable,
      skillsObservable,
      attributesObservable,
    ])
    */
    /*    const {
            "Blood Potency": bloodPotency,
            Health: health,
            Humanity: humanity,
            Willpower: willpower,
            Hunger: hunger,
          } = coreNumberTraitsData;

          const { Clan: clan, Name: name, Sire: sire } = coreStringTraitsData;

          const characterSheetData: iCharacterSheetData = {
            id: this.id,
            clan,
            name,
            sire,
            bloodPotency,
            health,
            humanity,
            willpower,
            hunger,
            attributes: recordToArray(attributesData),
            skills: recordToArray(skillsData),
            touchstonesAndConvictions: recordToArray(
              touchstoneOrConvictionsData
            ),
            disciplines: recordToArray(disciplinesData),
          };

          */

    const { outgoingUpdatesSubject, ref, firestoreDocumentUnsubscribe } =
      this.getCharacterSheetTraitsDocumentChangeSubject(this.path);

    this.#firestoreDocumentRef = ref;
    this.#unsubscribers.push(firestoreDocumentUnsubscribe);

    this.#outgoingUpdatesSubject = outgoingUpdatesSubject;
    this.changes = outgoingUpdatesSubject.asObservable();
  }

  /** Releases any resources */
  dispose() {
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
        if (newData === undefined) return outgoingUpdatesSubject.next(newData);

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

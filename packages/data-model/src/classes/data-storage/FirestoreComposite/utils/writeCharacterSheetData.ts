// todo test

import {
  arrayToRecord, ATTRIBUTE_COLLECTION_NAME,
  CHARACTER_SHEET_TRAIT_COMPOSITE_DOCUMENT_COLLECTION_NAME, CORE_TRAIT_COLLECTION_NAME,
  DISCIPLINE_COLLECTION_NAME, displayNameToPropertyName, Firestore, FirestoreBatch,
  SKILL_COLLECTION_NAME, TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME,
} from '@quirk-a-bot/common';

import {
  iCharacterSheetData,
} from '../../../character-sheet/interfaces/character-sheet-interfaces';
import { iGeneralTraitData } from '../../../traits/interfaces/trait-interfaces';
import { DocumentDataWriterProps } from '../../Firestore/utils/assertDocumentExistsOnFirestore';
import { createPath } from '../../utils/createPath';

function writeTraitCollectionCompositeAsBatch(
  firestore: Firestore,
  traitDataArray: iGeneralTraitData[],
  parentCollectionPath: string,
  traitCollectionName: string,
  batch: FirestoreBatch
) {
  const dataRecord = arrayToRecord({
    array: traitDataArray,
    propertyNameReducer: (el) => displayNameToPropertyName(el.name),
  });

  const path = createPath(parentCollectionPath, traitCollectionName);

  const compositeDocumentRef = firestore.doc(path);

  batch.set(compositeDocumentRef, dataRecord);
}

export default async function writeCharacterSheetDataToFirestoreComposite({
  firestore,
  path,
  data,
}: DocumentDataWriterProps<iCharacterSheetData>) {
  const {
    // core data
    id,
    clan,
    health,
    humanity,
    hunger,
    name,
    sire,
    willpower,
    bloodPotency,

    // trait collection data
    attributes,
    disciplines,
    skills,
    touchstonesAndConvictions,
  } = data;

  const coreData = {
    id,
  };

  const coreTraits: iGeneralTraitData[] = [
    clan,
    health,
    humanity,
    hunger,
    name,
    sire,
    willpower,
    bloodPotency,
  ];

  const timerName = `Time to write character sheet data at path ${path}`;
  console.time(timerName);
  try {
    const characterSheetDocRef = firestore.doc(path);

    // create new firestore batch
    const batch = firestore.batch();

    // write core data
    batch.set(characterSheetDocRef, coreData);

    // create the path to the subcollection of the character sheet where the composite documents with traits are contained
    const characterSheetTraitCompositesPath = createPath(
      path,
    CHARACTER_SHEET_TRAIT_COMPOSITE_DOCUMENT_COLLECTION_NAME
    );

    // write trait collection data as firestore collections
    writeTraitCollectionCompositeAsBatch(
      firestore,
      coreTraits,
      characterSheetTraitCompositesPath,
      CORE_TRAIT_COLLECTION_NAME,
      batch
    );
    writeTraitCollectionCompositeAsBatch(
      firestore,
      attributes,
      characterSheetTraitCompositesPath,
      ATTRIBUTE_COLLECTION_NAME,
      batch
    );
    writeTraitCollectionCompositeAsBatch(
      firestore,
      disciplines,
      characterSheetTraitCompositesPath,
      DISCIPLINE_COLLECTION_NAME,
      batch
    );
    writeTraitCollectionCompositeAsBatch(
      firestore,
      skills,
      characterSheetTraitCompositesPath,
      SKILL_COLLECTION_NAME,
      batch
    );
    writeTraitCollectionCompositeAsBatch(
      firestore,
      touchstonesAndConvictions,
      characterSheetTraitCompositesPath,
      TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME,
      batch
    );

    // commit batch
    await batch.commit();
  } catch (error) {
    console.error(
      __filename,
      `Error writing character sheet data to firestore as a batch`,
      { error, data }
    );
    console.timeEnd(timerName);
    return await Promise.reject(Error(error));
  } finally {
    console.timeEnd(timerName);
  }
}

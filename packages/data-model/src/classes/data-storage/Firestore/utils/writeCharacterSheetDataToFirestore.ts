// todo test

import {
  ATTRIBUTE_COLLECTION_NAME, CORE_TRAIT_COLLECTION_NAME, DISCIPLINE_COLLECTION_NAME, Firestore,
  FirestoreBatch, SKILL_COLLECTION_NAME, TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME,
} from '@quirk-a-bot/common';

import {
  iCharacterSheetData,
} from '../../../character-sheet/interfaces/character-sheet-interfaces';
import { iGeneralTraitData } from '../../../traits/interfaces/trait-interfaces';
import { DocumentDataWriterProps } from './assertDocumentExistsOnFirestore';

function writeTraitCollectionAsBatch(
  firestore: Firestore,
  traitDataArray: iGeneralTraitData[],
  characterSheetDocPath: string,
  traitCollectionName: string,
  batch: FirestoreBatch
) {
  traitDataArray.forEach((traitData) => {
    const traitDoc = firestore.doc(
      `${characterSheetDocPath}/${traitCollectionName}/${traitData.name}`
    );
    batch.set(traitDoc, traitData);
  });
}

export default async function writeCharacterSheetDataToFirestore({
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
    const csDocRef = firestore.doc(path);

    // create new firestore batch
    const batch = firestore.batch();

    // write core data
    batch.set(csDocRef, coreData);

    // write trait collection data as firestore collections
    writeTraitCollectionAsBatch(
      firestore,
      coreTraits,
      path,
      CORE_TRAIT_COLLECTION_NAME,
      batch
    );
    writeTraitCollectionAsBatch(
      firestore,
      attributes,
      path,
      ATTRIBUTE_COLLECTION_NAME,
      batch
    );
    writeTraitCollectionAsBatch(
      firestore,
      disciplines,
      path,
      DISCIPLINE_COLLECTION_NAME,
      batch
    );
    writeTraitCollectionAsBatch(
      firestore,
      skills,
      path,
      SKILL_COLLECTION_NAME,
      batch
    );
    writeTraitCollectionAsBatch(
      firestore,
      touchstonesAndConvictions,
      path,
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
  } finally {
    console.timeEnd(timerName);
  }
}

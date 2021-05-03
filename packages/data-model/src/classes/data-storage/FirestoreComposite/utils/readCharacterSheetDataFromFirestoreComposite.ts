import {
  ATTRIBUTE_COLLECTION_NAME, CHARACTER_SHEET_TRAIT_COMPOSITES_COLLECTION_NAME,
  CORE_TRAIT_COLLECTION_NAME, CoreTraitName, DISCIPLINE_COLLECTION_NAME, Firestore,
  SKILL_COLLECTION_NAME, TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME,
} from '@quirk-a-bot/common';

import { isCharacterSheetData } from '../../../../utils/type-predicates';
import isTraitData from '../../../../utils/type-predicates/isTraitData';
import {
  iCharacterSheetData,
} from '../../../character-sheet/interfaces/character-sheet-interfaces';
import { DocumentDataReaderProps } from '../../Firestore/utils/assertDocumentExistsOnFirestore';
import { createPath } from '../../utils/createPath';

// todo test

// todo use unkown over any for tbc values

async function readCompositeDocumentAsync(
  firestore: Firestore,
  parentCollectionPath: string,
  documentId: string
) {
  return firestore.doc(createPath(parentCollectionPath, documentId)).get();
}

export default async function readCharacterSheetDataFromFirestoreComposite({
  firestore,
  path,
}: DocumentDataReaderProps): Promise<iCharacterSheetData> {
  const timerName = `Time to read character sheet data at path ${path}`;
  console.time(timerName);

  // read core data first and confirm document exists
  const coreDataDocument = await firestore.doc(path).get();
  if (!coreDataDocument.exists)
    throw Error(`Cannot read document at path ${path} because it doesnt exist`);

  // create the path to the subcollection of the character sheet where the composite documents with traits are contained
  const characterSheetTraitCompositesPath = createPath(
    path,
    CHARACTER_SHEET_TRAIT_COMPOSITES_COLLECTION_NAME
  );

  // read trait collection data as firestore collections
  const coreTraitsPromise = readCompositeDocumentAsync(
    firestore,
    characterSheetTraitCompositesPath,
    CORE_TRAIT_COLLECTION_NAME
  );
  const attributesPromise = readCompositeDocumentAsync(
    firestore,
    characterSheetTraitCompositesPath,
    ATTRIBUTE_COLLECTION_NAME
  );
  const disciplinesPromise = readCompositeDocumentAsync(
    firestore,
    characterSheetTraitCompositesPath,
    DISCIPLINE_COLLECTION_NAME
  );
  const skillsPromise = readCompositeDocumentAsync(
    firestore,
    characterSheetTraitCompositesPath,
    SKILL_COLLECTION_NAME
  );
  const touchstonesAndConvictionsPromise = readCompositeDocumentAsync(
    firestore,
    characterSheetTraitCompositesPath,
    TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME
  );

  // fullfill promises as a batch
  const [
    coreTraitsCollection,
    attributesCollection,
    disciplinesCollection,
    skillsCollection,
    touchstonesAndConvictionsCollection,
  ] = await Promise.all([
    coreTraitsPromise,
    attributesPromise,
    disciplinesPromise,
    skillsPromise,
    touchstonesAndConvictionsPromise,
  ]);

  // get trait collection data
  const coreTraits = coreTraitsCollection.data();
  const attributes: unknown[] = Object.values(
    attributesCollection.data() || {}
  );
  const disciplines: unknown[] = Object.values(
    disciplinesCollection.data() || {}
  );
  const skills: unknown[] = Object.values(skillsCollection.data() || {});
  const touchstonesAndConvictions: unknown[] = Object.values(
    touchstonesAndConvictionsCollection.data() || {}
  );

  // add the core data and collection data
  const data: Record<string, unknown> = {
    ...coreDataDocument.data(),
    attributes,
    disciplines,
    skills,
    touchstonesAndConvictions,
  };

  // add core traits to base object
  if (coreTraits)
    Object.entries(coreTraits).forEach(([propertyName, trait]) => {
      if (!isTraitData(trait)) return;
      /*
      const propertyName = coreTraitDisplayNameToPropertyName(
        trait.name as CoreTraitName
      );
      */
      data[propertyName] = trait;
    });

  console.timeEnd(timerName);

  // confirm data is in the right format
  if (!isCharacterSheetData(data)) {
    const error = `Resulting data read from firestore in document at path "${path}" is not valid character sheet data`;
    console.error(__filename, {
      error,
      data,
      coreTraitsFromFirestore: coreTraits,
    });
    throw Error(error);
  }

  return data;
}

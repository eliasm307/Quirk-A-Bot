import {
  ATTRIBUTE_COLLECTION_NAME, CORE_TRAIT_COLLECTION_NAME, CoreTraitName, DISCIPLINE_COLLECTION_NAME,
  Firestore, SKILL_COLLECTION_NAME, TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME,
} from '@quirk-a-bot/common';

import { isCharacterSheetData } from '../../../../utils/type-predicates';
import {
  iCharacterSheetData,
} from '../../../character-sheet/interfaces/character-sheet-interfaces';
import { createPath } from '../../utils/createPath';
import { DocumentDataReaderProps } from './assertDocumentExistsOnFirestore';

// todo test

function coreTraitDisplayNameToPropertyName(
  displayName: CoreTraitName
): string {
  // remove all spaces

  const noSpaces = displayName.replace(/\s/g, "");

  // make first letter lower case
  return noSpaces.charAt(0).toLowerCase() + noSpaces.slice(1);
}

async function readTraitCollectionPromise(
  firestore: Firestore,
  parentDocPath: string,
  collectionName: string
) {
  return firestore.collection(createPath(parentDocPath, collectionName)).get();
}

export default async function readCharacterSheetDataFromFirestore({
  firestore,
  path,
}: DocumentDataReaderProps): Promise<iCharacterSheetData> {
  const timerName = `Time to read character sheet data at path ${path}`;
  console.time(timerName);

  // read core data first and confirm document exists
  const coreDataDocument = await firestore.doc(path).get();
  if (!coreDataDocument.exists)
    throw Error(
      `Cannot read document at path ${path} because it doesn't  exist`
    );

  // read trait collection data as firestore collections
  const coreTraitsPromise = readTraitCollectionPromise(
    firestore,
    path,
    CORE_TRAIT_COLLECTION_NAME
  );
  const attributesPromise = readTraitCollectionPromise(
    firestore,
    path,
    ATTRIBUTE_COLLECTION_NAME
  );
  const disciplinesPromise = readTraitCollectionPromise(
    firestore,
    path,
    DISCIPLINE_COLLECTION_NAME
  );
  const skillsPromise = readTraitCollectionPromise(
    firestore,
    path,
    SKILL_COLLECTION_NAME
  );
  const touchstonesAndConvictionsPromise = readTraitCollectionPromise(
    firestore,
    path,
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
  const coreTraits = coreTraitsCollection.docs.map((doc) => doc.data());

  const attributes = attributesCollection.docs.map((doc) => doc.data());
  const disciplines = disciplinesCollection.docs.map((doc) => doc.data());
  const skills = skillsCollection.docs.map((doc) => doc.data());
  const touchstonesAndConvictions = touchstonesAndConvictionsCollection.docs.map(
    (doc) => doc.data()
  );

  // add the core data and collection data
  const data: any = {
    ...coreDataDocument.data(),
    attributes,
    disciplines,
    skills,
    touchstonesAndConvictions,
  };

  // add core traits to base object
  coreTraits.forEach((trait) => {
    const propertyName = coreTraitDisplayNameToPropertyName(trait.name);
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

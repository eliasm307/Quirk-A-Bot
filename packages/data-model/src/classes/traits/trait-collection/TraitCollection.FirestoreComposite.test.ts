import {
  ATTRIBUTE_COLLECTION_NAME, DISCIPLINE_COLLECTION_NAME, firestoreEmulator, pause,
  SKILL_COLLECTION_NAME, TRAIT_COMPOSITE_DOCUMENT_COLLECTION_NAME,
} from '@quirk-a-bot/common';

import { AttributeName, DisciplineName, SkillName } from '../../../declarations/types';
import isTraitData from '../../../utils/type-predicates/isTraitData';
import FirestoreCompositeDataStorageFactory from '../../data-storage/FirestoreComposite/DataStorageFactory';
import { iTraitCollectionFactoryMethodProps } from '../interfaces/trait-collection-interfaces';
import { iBaseTraitData, iGeneralTraitData } from '../interfaces/trait-interfaces';
import TraitFactory from '../TraitFactory';

const firestore = firestoreEmulator;

const dataStorageFactory = new FirestoreCompositeDataStorageFactory({
  firestore,
});

const rootCollectionPath =
  "FirestoreCompositeDataStorageFactory-traitCollectionTests";

const getTraitCollectionPath = (
  parentPath: string,
  traitCollectionName: string
) =>
  `${parentPath}/${TRAIT_COMPOSITE_DOCUMENT_COLLECTION_NAME}/${traitCollectionName}`;

const createTraitCollectionFactoryMethodProps = (
  groupName: string
): iTraitCollectionFactoryMethodProps => ({
  traitCollectionDataStorageInitialiser: dataStorageFactory.newTraitCollectionDataStorageInitialiser(),
  // traitDataStorageInitialiser: dataStorageFactory.newTraitDataStorageInitialiser(),
  parentPath: `${rootCollectionPath}/${groupName}`,
  loggerCreator: null,
});

const readTraitCollectionInFirestore = async <D extends iGeneralTraitData>(
  collectionPath: string
): Promise<D[]> => {
  const collectionSnapshot = await firestore.doc(collectionPath).get();
  const data = collectionSnapshot.data();
  return (data ? Object.values(data) : []) as D[];
};

const deleteExistingCollectionDataAsync = async (collectionPath: string) => {
  // delete any existing data in the collection

  try {
    await firestore.doc(collectionPath).delete();
    return;
  } catch (error) {
    return Promise.reject(
      console.error(
        `Trait collection at path ${collectionPath} had an error occurred while deleting it`,
        { error }
      )
    );
  }
};

describe("Trait collection with Firestore data storage adding, and deleting", () => {
  it("adds traits to firestore collection", async () => {
    expect.hasAssertions();

    const props = createTraitCollectionFactoryMethodProps(
      "testingCollectionFromBlankAdding"
    );
    const expectedCollectionPath = getTraitCollectionPath(
      props.parentPath,
      ATTRIBUTE_COLLECTION_NAME
    );

    // run tests after deleting any existing data
    await deleteExistingCollectionDataAsync(expectedCollectionPath);

    // NOTE firestore doesn't  hold empty collections, no need to test when empty
    const tc = TraitFactory.newAttributeTraitCollection(props);

    // test adding traits
    await tc.set("Charisma", 1);
    await tc.set("Composure", 2);
    await tc.set("Resolve", 3);

    const tcDataExpected: iBaseTraitData<AttributeName, number>[] = [
      { name: "Charisma", value: 1 },
      { name: "Composure", value: 2 },
      { name: "Resolve", value: 3 },
    ];

    await pause(4000); // wait for synchronisation

    // get snapshot data
    const collectionDocumentData = await readTraitCollectionInFirestore(
      tc.path
    );

    console.log({ tcDataExpected, tcDataActual: collectionDocumentData });

    expect.assertions(4);
    expect(collectionDocumentData.length).toEqual(3);
    expect(collectionDocumentData.every(isTraitData)).toBe(true);
    expect(collectionDocumentData).toEqual(tcDataExpected);
    expect(tc.cleanUp()).toEqual(true); // can clean up
  }, 19999);

  it("deletes traits from firestore collection", async () => {
    expect.hasAssertions();

    const props = createTraitCollectionFactoryMethodProps(
      "testingCollectionFromBlankDeleting"
    );

    const expectedCollectionPath = getTraitCollectionPath(
      props.parentPath,
      ATTRIBUTE_COLLECTION_NAME
    );

    // run tests after deleting any existing data
    await deleteExistingCollectionDataAsync(expectedCollectionPath);

    // NOTE firestore doesn't  hold empty collections, no need to test when empty
    const tc = TraitFactory.newAttributeTraitCollection(props);

    await pause(200); // wait for synchronisation

    // add some traits
    await tc.set("Charisma", 1);
    await tc.set("Composure", 2);
    await tc.set("Resolve", 3);

    await pause(200); // wait for synchronisation

    // test deleting some items
    await tc.delete("Charisma");
    await tc.delete("Composure");

    await pause(200); // wait for synchronisation

    // get snapshot data
    // get snapshot data
    let collectionDocumentData = await readTraitCollectionInFirestore(tc.path);

    expect(collectionDocumentData.length).toEqual(1);
    expect(collectionDocumentData).toEqual([{ name: "Resolve", value: 3 }]);

    // delete the rest of the items
    await tc.delete("Resolve");
    await pause(200); // wait for synchronisation

    // get snapshot data
    collectionDocumentData = await readTraitCollectionInFirestore(tc.path);

    expect(collectionDocumentData.length).toEqual(0);
    expect(collectionDocumentData).toEqual([]);

    // can clean up
    expect(tc.cleanUp()).toEqual(true);
  }, 9999);

  it("cleans up", () => {
    expect.hasAssertions();

    const props = createTraitCollectionFactoryMethodProps(
      "testingCollectionFromBlankCleanup"
    );

    // NOTE firestore doesn't  hold empty collections, no need to test when empty
    const tc = TraitFactory.newAttributeTraitCollection(props);

    // test cleanup
    expect(tc.cleanUp()).toEqual(true);
  });
});

describe("Trait collection with Firestore data storage", () => {
  it("can initialise a firestore collection from initial trait data", async () => {
    expect.hasAssertions();

    // name this test group path
    const props = createTraitCollectionFactoryMethodProps(
      "testingCollectionFromExistingData"
    );

    const expectedPath = getTraitCollectionPath(
      props.parentPath,
      SKILL_COLLECTION_NAME
    );

    // delete any existing data
    await deleteExistingCollectionDataAsync(expectedPath);

    const initialData: iBaseTraitData<SkillName, number>[] = [
      { name: "Academics", value: 1 },
      { name: "Animal Ken", value: 2 },
      { name: "Athletics", value: 3 },
    ];

    // note uses different collection than other tests for different path
    const tc = TraitFactory.newSkillTraitCollection(props, ...initialData);

    await pause(500); // wait for synchronisation

    // get snapshot data
    const collectionDocumentData = await readTraitCollectionInFirestore(
      tc.path
    );

    expect(collectionDocumentData.length).toEqual(3);
    expect(collectionDocumentData).toEqual(initialData);

    // can clean up
    expect(tc.cleanUp()).toEqual(true);
  }, 19999);

  it("listens to firestore and propagates changes to all trait collection instances", async () => {
    expect.hasAssertions();

    // name this test group path
    const props = createTraitCollectionFactoryMethodProps(
      "testingEventListeners"
    );
    const expectedCollectionPath = getTraitCollectionPath(
      props.parentPath,
      DISCIPLINE_COLLECTION_NAME
    );

    // delete any existing data
    await deleteExistingCollectionDataAsync(expectedCollectionPath);

    await pause(200); // wait for synchronisation

    // note uses different collection than other tests for different path
    const tc1 = TraitFactory.newDisciplineTraitCollection(props);
    const tc2 = TraitFactory.newDisciplineTraitCollection(props);

    await pause(200); // wait for synchronisation

    // expect empty collections
    expect(tc1.path).toEqual(expectedCollectionPath);
    expect(tc2.path).toEqual(expectedCollectionPath);
    expect(tc1.size).toBe(0);
    expect(tc1.size).toEqual(tc2.size);

    // make changes to collection 1
    await tc1.set("Animalism", 1);
    await tc1.set("Blood Sorcery", 2);
    await tc1.set("Celerity", 3);
    await pause(200); // wait for synchronisation

    await tc1.set("Celerity", 5);

    const resultingData: iBaseTraitData<DisciplineName, number>[] = [
      { name: "Animalism", value: 1 },
      { name: "Blood Sorcery", value: 2 },
      { name: "Celerity", value: 5 },
    ];

    await pause(200); // wait for synchronisation

    // expect collection 2 to have the changes
    expect(tc2.size).toEqual(3);
    expect(tc2.data()).toEqual(tc1.data());
    expect(tc2.data()).toEqual(resultingData);

    // can clean up
    expect(tc1.cleanUp()).toEqual(true);
    expect(tc2.cleanUp()).toEqual(true);
  }, 9999);
});

import {
  ATTRIBUTE_COLLECTION_NAME,
  DISCIPLINE_COLLECTION_NAME,
  firestoreEmulator,
  pause,
  SKILL_COLLECTION_NAME,
} from "@quirk-a-bot/common";

import {
  AttributeName,
  DisciplineName,
  SkillName,
} from "../../../declarations/types";
import isTraitData from "../../../utils/type-predicates/isTraitData";
import FirestoreDataStorageFactory from "../../data-storage-OLD/Firestore/FirestoreDataStorageFactory";
import { createPath } from "../../data-storage-OLD/utils/createPath";
import { iTraitCollectionFactoryMethodProps } from "../interfaces/trait-collection-interfaces";
import { iBaseTraitData } from "../interfaces/trait-interfaces";
import TraitFactory from "../TraitFactory";

// todo make these tests relevant

const firestore = firestoreEmulator;

const dataStorageFactory = new FirestoreDataStorageFactory({ firestore });

const rootCollectionPath = "FirestoreDataStorageFactory-traitCollectionTests";

const createTraitCollectionFactoryMethodProps = (
  groupName: string
): iTraitCollectionFactoryMethodProps => ({
  traitCollectionDataStorageInitialiser:
    dataStorageFactory.newTraitCollectionDataStorageInitialiser(),
  // traitDataStorageInitialiser: dataStorageFactory.newTraitDataStorageInitialiser(),
  parentPath: `${rootCollectionPath}/${groupName}`,
  loggerCreator: null,
  dataStorageFactory,
});

const deleteExistingCollectionDataAsync = async (collectionPath: string) => {
  // delete any existing data in the collection
  const collectionSnapshot = await firestore.collection(collectionPath).get();
  // if (collectionSnapshot.size) {
  try {
    await Promise.all(
      collectionSnapshot.docs.map((doc) => {
        // const docId = doc.id;
        return doc.ref.delete();
        // .then(() => console.log(`Deleted a trait from collection at path ${collectionPath} with id ${docId}`));
      })
    );
    return;
  } catch (error) {
    return Promise.reject(
      console.error(
        `Trait collection at path ${collectionPath} had some initial data, an error occurred while deleting it`,
        {
          path: collectionPath,
          existingFirestoreData: collectionSnapshot.docs.map((doc) =>
            doc.data()
          ),
          error,
        }
      )
    );
  }
  //	}
};

describe("Trait collection with Firestore data storage adding, and deleting", () => {
  it("adds traits to firestore collection", async () => {
    expect.hasAssertions();

    const props = createTraitCollectionFactoryMethodProps(
      "testingCollectionFromBlankAdding"
    );

    const expectedPath = createPath(
      props.parentPath,
      ATTRIBUTE_COLLECTION_NAME
    );

    // run tests after deleting any existing data
    await deleteExistingCollectionDataAsync(expectedPath);

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
    const collectionSnapshot = await firestore.collection(tc.path).get();
    const collectionDocumentData = collectionSnapshot.docs.map((doc) =>
      doc.data()
    );

    console.log({ tcDataExpected, tcDataActual: collectionDocumentData });

    expect(collectionDocumentData.length).toEqual(3);
    expect(collectionSnapshot.size).toEqual(3);
    expect(collectionDocumentData.every(isTraitData)).toBe(true);
    expect(collectionDocumentData).toEqual(tcDataExpected);

    // can clean up
    expect(tc.cleanUp()).toEqual(true);
  }, 19999);
  it("deletes traits from firestore collection", async () => {
    expect.hasAssertions();

    const props = createTraitCollectionFactoryMethodProps(
      "testingCollectionFromBlankDeleting"
    );

    const expectedPath = createPath(
      props.parentPath,
      ATTRIBUTE_COLLECTION_NAME
    );

    // run tests after deleting any existing data
    await deleteExistingCollectionDataAsync(expectedPath);

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
    let collectionSnapshot = await firestore.collection(tc.path).get();
    let collectionDocumentData = collectionSnapshot.docs.map((doc) =>
      doc.data()
    );

    expect(collectionSnapshot.size).toEqual(1);
    expect(collectionDocumentData.length).toEqual(1);
    expect(collectionDocumentData).toEqual([{ name: "Resolve", value: 3 }]);

    // delete the rest of the items
    await tc.delete("Resolve");
    await pause(200); // wait for synchronisation

    // get snapshot data
    collectionSnapshot = await firestore.collection(tc.path).get();
    collectionDocumentData = collectionSnapshot.docs.map((doc) => doc.data());

    expect(collectionSnapshot.size).toEqual(0);
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

    // delete any existing data
    await deleteExistingCollectionDataAsync(
      `${props.parentPath}/${SKILL_COLLECTION_NAME}`
    );

    const initialData: iBaseTraitData<SkillName, number>[] = [
      { name: "Academics", value: 1 },
      { name: "Animal Ken", value: 2 },
      { name: "Athletics", value: 3 },
    ];

    // note uses different collection than other tests for different path
    const tc = TraitFactory.newSkillTraitCollection(props, ...initialData);

    await pause(200); // wait for synchronisation

    // get snapshot data
    const collectionSnapshot = await firestore.collection(tc.path).get();
    const collectionDocumentData = collectionSnapshot.docs.map((doc) =>
      doc.data()
    );

    expect(collectionSnapshot.size).toEqual(3);
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
    const expectedPath = createPath(
      props.parentPath,
      DISCIPLINE_COLLECTION_NAME
    );

    // delete any existing data
    await deleteExistingCollectionDataAsync(expectedPath);

    await pause(200); // wait for synchronisation

    // note uses different collection than other tests for different path
    const tc1 = TraitFactory.newDisciplineTraitCollection(props);
    const tc2 = TraitFactory.newDisciplineTraitCollection(props);

    await pause(200); // wait for synchronisation

    // expect empty collections
    expect(tc1.path).toEqual(expectedPath);
    expect(tc2.path).toEqual(expectedPath);
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
  }, 19999);
});

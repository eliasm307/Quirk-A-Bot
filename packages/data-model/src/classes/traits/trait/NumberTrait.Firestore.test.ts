import { firestoreEmulator, pause } from '@quirk-a-bot/common';

import isTraitData from '../../../utils/type-predicates/isTraitData';
import FirestoreDataStorageFactory from '../../data-storage/Firestore/FirestoreDataStorageFactory';
import { iBaseTraitData, iGeneralTraitData } from '../interfaces/trait-interfaces';
import NumberTrait from './NumberTrait';

const firestore = firestoreEmulator;

const dataStorageFactory = new FirestoreDataStorageFactory({ firestore });
const traitDataStorageInitialiser =
  dataStorageFactory.newTraitDataStorageInitialiser();
const testSuiteParentPath = "numberTrait-firestore";

const baseProps = {
  traitDataStorageInitialiser,
  dataStorageFactory,
  loggerCreator: null,
};

describe("Number trait with firestore data storage", () => {
  it("asserts trait exists in firestore in the right format", async () => {
    const trait1Name = "trait1";
    const testParentPath = `${testSuiteParentPath}-trait-exists`;

    const trait1 = new NumberTrait<string>({
      ...baseProps,
      max: 10,
      name: trait1Name,
      value: 5.2,
      parentPath: testParentPath,
    });

    await pause(1000); // wait for synchronisation

    const doc = await firestore.doc(trait1.path).get();
    const data = doc.data();

    expect.assertions(5);

    expect(doc).toBeTruthy();
    expect(doc.exists).toEqual(true);
    expect(isTraitData(data)).toEqual(true);
    expect(data).toEqual(trait1.data());

    // can clean up
    expect(trait1.cleanUp()).toEqual(true);
  }, 19999);

  it("writes changes to firestore", async () => {
    const trait1Name = "trait1";
    const testParentPath = `${testSuiteParentPath}-trait-writes`;

    const trait1 = new NumberTrait<string>({
      ...baseProps,
      max: 10,
      name: trait1Name,
      value: 5.2,
      parentPath: testParentPath,
    });

    await pause(100); // wait for synchronisation

    await trait1.setValue(0);
    await trait1.setValue(1);

    await pause(100); // wait for synchronisation

    const doc = await firestore.doc(trait1.path).get();
    const data = doc.data() as iBaseTraitData<string, number>;

    expect.assertions(2);

    expect(data.value).toEqual(1);

    // can clean up
    expect(trait1.cleanUp()).toEqual(true);
  }, 9999);

  test("uses any existing value in firestore over the instance value", async () => {
    const trait1Name = "trait1";
    const testParentPath = `${testSuiteParentPath}-trait-init`;

    const trait1 = new NumberTrait<string>({
      ...baseProps,
      max: 10,
      name: trait1Name,
      value: 5.2,
      parentPath: testParentPath,
    });
    await pause(100); // wait for synchronisation

    const trait2 = new NumberTrait<string>({
      ...baseProps,
      max: 10,
      name: trait1Name,
      value: 5,
      parentPath: testParentPath,
    });

    await pause(100); // wait for synchronisation

    const knownValue = 0;

    // set trait to a known value
    await trait1.setValue(knownValue);

    await pause(100); // wait for synchronisation

    const doc1 = await firestore.doc(trait1.path).get();
    const doc2 = await firestore.doc(trait2.path).get();

    const doc1Data: any = doc1.data();
    const doc2Data = doc2.data() as iGeneralTraitData;

    expect.assertions(4);

    expect(doc1Data).toEqual(doc2Data);
    expect(doc2Data.value).toEqual(knownValue);

    // can clean up
    expect(trait1.cleanUp()).toEqual(true);
    expect(trait2.cleanUp()).toEqual(true);
  });
  it("listens to firestore and propagates changes to all trait instances", async () => {
    const trait1Name = "trait1";
    const testParentPath = `${testSuiteParentPath}-trait-listeners`;

    const initialValue = 0;
    const changeValue = 0;
    const trait1 = new NumberTrait<string>({
      ...baseProps,
      max: 10,
      name: trait1Name,
      value: 5.2,
      parentPath: testParentPath,
    });

    await pause(100); // wait for synchronisation

    const trait2 = new NumberTrait<string>({
      ...baseProps,
      max: 10,
      name: trait1Name,
      value: 5,
      parentPath: testParentPath,
    });

    await pause(100); // wait for synchronisation

    // set initial values
    await trait1.setValue(initialValue);

    await pause(100); // wait for synchronisation

    await trait2.setValue(initialValue);

    await pause(100); // wait for synchronisation

    // change one trait
    await trait1.setValue(changeValue);

    await pause(100); // wait for synchronisation

    expect.assertions(3);
    // check if other trait synchronised
    expect(trait2.value).toEqual(changeValue);

    // can clean up
    expect(trait1.cleanUp()).toEqual(true);
    expect(trait2.cleanUp()).toEqual(true);
  });
});

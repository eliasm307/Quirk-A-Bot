import { firestoreEmulator } from '@quirk-a-bot/firebase-utils';

import SubDocument from './SubDocument';

const firestore = firestoreEmulator;

type testSubDocType = {
  prop1: string;
  prop2?: number;
  prop3: boolean[];
  prop4: { prop1: any[] };
};
type testSubDocKeyType = "a" | "b" | "c" | "d";

const rootCollectionPath = "sub-document-tests";

describe("SubDocument", () => {
  it("can be initialised from existing data, read locally, write locally, and initiate write to firestore", async () => {
    expect.hasAssertions();
    const updateOnFirestore = jest.fn();
    const onChangeCallback = jest.fn();
    const deleteFromDataStorage = jest.fn();
    const key: testSubDocKeyType = "b";
    const parentDocumentPath = `${rootCollectionPath}/writeTest`;
    const data: testSubDocType = {
      prop1: "weew",
      prop2: 232,
      prop3: [false, true],
      prop4: { prop1: [1, true, null, undefined] },
    };

    const subDocument = new SubDocument<testSubDocKeyType, testSubDocType>({
      data,
      firestore,
      updateOnDataStorage: updateOnFirestore,
      key,
      parentDocumentPath,
      onChangeCallback,
      deleteFromDataStorage,
    });

    // read locallly and instantiated from existing data
    expect(subDocument.data).toEqual(data);

    const dataEditted: testSubDocType = {
      prop1: "weewedcd f   ffdeded",
      prop2: 232,
      prop3: [true, true, true],
      prop4: { prop1: [1, true, 1, 1, 1, undefined] },
    };

    // write locally and to firestore
    await subDocument.setData(dataEditted);

    expect(subDocument.data).toEqual(dataEditted);
    expect(onChangeCallback).toHaveBeenCalledTimes(1);
    expect(onChangeCallback).toHaveBeenCalledWith(dataEditted);
    expect(updateOnFirestore).toHaveBeenCalledTimes(1);

    // write locally only
    await subDocument.setDataLocallyOnly(data);

    expect(subDocument.data).toEqual(data);
    expect(onChangeCallback).toHaveBeenCalledTimes(2);
    expect(onChangeCallback).toHaveBeenCalledWith(data);
    expect(updateOnFirestore).toHaveBeenCalledTimes(1);
  });
  it("can handle delete", () => {
    expect.hasAssertions();
    const updateOnFirestore = jest.fn();
    const onChangeCallback = jest.fn();
    const deleteFromDataStorage = jest.fn();
    const key: testSubDocKeyType = "b";
    const parentDocumentPath = `${rootCollectionPath}/deleteTest`;
    const data: testSubDocType = {
      prop1: "weew",
      prop2: 232,
      prop3: [false, true],
      prop4: { prop1: [1, true, null, undefined] },
    };

    const subDocument = new SubDocument<testSubDocKeyType, testSubDocType>({
      data,
      firestore,
      updateOnDataStorage: updateOnFirestore,
      key,
      parentDocumentPath,
      onChangeCallback,
      deleteFromDataStorage: deleteFromDataStorage,
    });
    subDocument.delete();

    expect(deleteFromDataStorage).toHaveBeenCalledTimes(1);
  });
});

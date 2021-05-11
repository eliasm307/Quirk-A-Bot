import { firestoreEmulator } from '../FirebaseExports';
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

    // todo fix this test

    const firestoreDataMock: testSubDocType = {
      prop1: "",
      prop2: 0,
      prop3: [],
      prop4: { prop1: [] },
    };

    const getDataFromStorage = jest.fn(() => firestoreDataMock);
    const setOnDataStorage = jest.fn();
    const deleteFromDataStorage = jest.fn();
    const key: testSubDocKeyType = "b";
    const parentDocumentPath = `${rootCollectionPath}/writeTest`;
    const data: testSubDocType = {
      prop1: "test 123",
      prop2: 232,
      prop3: [false, true],
      prop4: { prop1: [1, true, null, undefined] },
    };

    const subDocument = new SubDocument<
      Record<testSubDocKeyType, testSubDocType>
    >({
      firestore,
      key,
      parentDocumentPath,
      deleteFromDataStorage: async () => {
        Object.assign(firestoreDataMock, undefined);
      },
      getDataFromStorage: () => firestoreDataMock,
      setOnDataStorage: async (newData) => {
        for (const [_key, value] of Object.entries(newData)) {
          const key = _key as keyof typeof firestoreDataMock;

          // if (value) firestoreDataMock[key] = value;
        }
      },
    });

    // read locally and instantiated from existing data
    // expect(subDocument.data).toEqual(data);

    // get call
    const data1 = subDocument.data;

    const dataEdited: testSubDocType = {
      prop1: "test f   ffdeded",
      prop2: 232,
      prop3: [true, true, true],
      prop4: { prop1: [1, true, 1, 1, 1, undefined] },
    };

    // write locally and to firestore
    await subDocument.setValue(dataEdited);

    // expect(subDocument.data).toEqual(dataEdited);
    expect(getDataFromStorage).toHaveBeenCalledTimes(1);
    expect(setOnDataStorage).toHaveBeenCalledWith(dataEdited);
    expect(setOnDataStorage).toHaveBeenCalledTimes(1);

    // write locally only
    subDocument.setDataLocallyOnly(data);

    // expect(subDocument.data).toEqual(data);
    // expect(onChangeCallback).toHaveBeenCalledTimes(2);
    expect(setOnDataStorage).toHaveBeenCalledWith(data);
    expect(setOnDataStorage).toHaveBeenCalledTimes(1);
  });

  it("can handle delete", () => {
    expect.hasAssertions();
    const setOnDataStorage = jest.fn();
    const getDataFromStorage = jest.fn();
    const deleteFromDataStorage = jest.fn();
    const key: testSubDocKeyType = "b";
    const parentDocumentPath = `${rootCollectionPath}/deleteTest`;
    const data: testSubDocType = {
      prop1: "test 123",
      prop2: 232,
      prop3: [false, true],
      prop4: { prop1: [1, true, null, undefined] },
    };

    const subDocument = new SubDocument<
      Record<testSubDocKeyType, testSubDocType>,
      testSubDocKeyType
    >({
      firestore,
      key,
      parentDocumentPath,
      deleteFromDataStorage: deleteFromDataStorage,
      getDataFromStorage,
      setOnDataStorage,
    });
    subDocument.delete();

    expect(deleteFromDataStorage).toHaveBeenCalledTimes(1);
  });
});

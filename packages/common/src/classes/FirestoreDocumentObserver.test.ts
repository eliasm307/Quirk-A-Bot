import { type } from 'os';

import { firestore } from '../FirebaseExports';
import FirestoreDocumentObserver, {
  FirestoreDocumentChangeData,
} from './FirestoreDocumentObserver';

const rootCollectionPath = `FirestoreDocumentObserverTests`;

/*
const handleChange: <D>(changeData: FirestoreDocumentChangeData<D>) => void = (
  changeData
) => console.log(__filename, `Document Change`, changeData);
*/

interface SCHEMA {
  boolProp: boolean;
  nullProp: null;
  numberProp: number;
  objProp: { stringProp: string };
  stringArrayProp: string[];
  stringProp: string;

  // undefinedProp: undefined; // ! undefined not allowed by firestore
}

const documentSchemaIsValid = (data: unknown): data is SCHEMA => {
  if (data === undefined) return true; // undefined values represent documents that don't exist yet, this is valid
  if (typeof data !== "object") {
    console.error(`Data received was not an object`, {
      data,
      typeOfData: typeof data,
    });
    return false;
  }

  const {
    stringArrayProp,
    numberProp,
    boolProp,
    objProp,
    nullProp,
    stringProp,
  } = data as SCHEMA;

  const objPropIsValid =
    typeof objProp === "object" && typeof objProp.stringProp === "string";

  const stringArrayPropIsValid =
    Array.isArray(stringArrayProp) &&
    stringArrayProp.reduce(
      (allStrings, current) => allStrings && typeof current === "string",
      true
    );

  const schemaIsValid =
    typeof stringProp === "string" &&
    typeof numberProp === "number" &&
    typeof boolProp === "boolean" &&
    nullProp === null &&
    objPropIsValid &&
    stringArrayPropIsValid;

  return schemaIsValid;
};

const goodData1: SCHEMA = {
  boolProp: true,
  nullProp: null,
  numberProp: 3,
  objProp: { stringProp: "string prop" },
  stringArrayProp: ["string 1", "string 2"],
  stringProp: "string prop",
};

const goodData2: SCHEMA = {
  boolProp: false,
  nullProp: null,
  numberProp: 3343,
  objProp: { stringProp: "string prop" },
  stringArrayProp: ["string 1", "string 2", "string 3", "string 4"],
  stringProp: "string prop",
};

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

describe("FirestoreDocumentObserver", () => {
  it("can detect document when a document is created, updated, and deleted", async () => {
    expect.hasAssertions();
    // expect.assertions(3);

    const path = `${rootCollectionPath}/CUD-test`;
    let eventCount = 0;

    // make sure test doc doesn't exist
    await firestore.doc(path).delete();

    await sleep(1000);

    // event 1: should fire an initial change event?
    console.warn(`observer load`);
    const observer = new FirestoreDocumentObserver<SCHEMA>({
      firestore,
      handleChange: (changeData) => {
        const { snapshot, ...dataToPrint } = changeData;

        // increment event count
        eventCount++;

        console.log(__filename, `Document Change`, {
          ...dataToPrint,
          eventCount,
        });
        expect(changeData).toBeTruthy();

        const {
          oldData,
          newData,
          snapshot: { exists },
        } = changeData;

        switch (eventCount) {
          case 1: // initial read event
            expect(exists).toBeFalsy();
            expect(oldData).toEqual(undefined);
            return expect(newData).toBeUndefined();
          case 2: // initial create
            expect(exists).toBeTruthy();
            expect(oldData).toEqual(undefined);
            return expect(newData).toEqual(goodData1);
          case 3: // change
            expect(exists).toBeTruthy();
            expect(oldData).toEqual(goodData1);
            return expect(newData).toEqual(goodData2);
          case 4: // delete
            expect(exists).toBeFalsy();
            expect(oldData).toEqual(goodData2);
            return expect(newData).toBeUndefined();
          default:
            const error = "there were more events than expected";
            console.error({ error, changeData });
            throw Error(error);
        }
      },
      path,
      documentSchemaPredicate: documentSchemaIsValid,
    });

    await sleep(3000);

    // 2 fires a change event for doc being set initially
    console.warn(`initial set`);
    await firestore.doc(path).set(goodData1);
    // await sleep(1000);

    // 3 fires a change event for doc being changed
    console.warn(`change`);
    await firestore.doc(path).set(goodData2);
    await sleep(1000);

    // 4 fires a change event for doc being deleted
    console.warn(`delete`);
    await firestore.doc(path).delete();
    await sleep(1000);

    // it should unsubscribe with no issues
    expect(observer.unsubscribe()).toBeUndefined();
  }, 99999);

  it("can detect when the document schema is valid on load and on changes", () => {
    expect.hasAssertions();
  });
  it("allows multiple key and/or value types", () => {
    expect.hasAssertions();
  });
  it("can detect when the document schema is invalid", () => {
    expect.hasAssertions();
  });
});

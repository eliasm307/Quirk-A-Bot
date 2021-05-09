import { type } from 'os';

import { firestoreEmulator } from '../FirebaseExports';
import FirestoreDocumentObserver, {
  FirestoreDocumentChangeData,
} from './FirestoreDocumentObserver';

const firestore = firestoreEmulator;

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

const documentSchemaIsValid = (data: any): data is SCHEMA => {
  if (data === undefined) return true; // undefined values represent documents that dont exist yet, this is valid
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
  objProp: { stringProp: "dkkd" },
  stringArrayProp: ["ede", "mnedi"],
  stringProp: "kncrnci",
};

const goodData2: SCHEMA = {
  boolProp: false,
  nullProp: null,
  numberProp: 3343,
  objProp: { stringProp: "dkkdcedecce" },
  stringArrayProp: ["ede", "mnedi", "nciecnic", "kncice", "ekcnice"],
  stringProp: "kncrnci",
};

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

describe("FirestoreDocumentObserver", () => {
  it("can detect document when a document is created, updated, and deleted", async () => {
    expect.hasAssertions();
    // expect.assertions(3);

    const path = `${rootCollectionPath}/CUD-test`;
    let eventCount = 0;

    // make sure test doc doesnt exist
    await firestore.doc(path).delete();

    await sleep(1000);

    // event 1: should fire an initial change event?
    console.warn(`observer load`);
    const observer = await FirestoreDocumentObserver.load<SCHEMA>({
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

        const { exists, oldData, newData } = changeData;
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
      documentSchemaIsValid,
    });

    await sleep(3000);

    // 2 fires a change event for doc being set intially
    console.warn(`intial set`);
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

    // it should unsubsribe with no issues
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

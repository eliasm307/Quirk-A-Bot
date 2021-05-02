import { firestoreEmulator } from '../FirebaseExports';
import pause from '../utils/pause';
import InconsistentCompositeDocument, {
  InconsistentCompositeDocumentLoaderProps,
} from './InconsistentCompositeDocument';

const firestore = firestoreEmulator;

const rootPath = `DocumentGroupTests`;

interface S {
  boolVal: boolean;
  objVal: {
    val1: string;
  };
  stringVal: string;
}

const valuePredicates: Record<keyof S, (value: any) => value is S[keyof S]> = {
  boolVal: (value): value is boolean => typeof value === "boolean",
  objVal: (value): value is any => typeof value === "object",
  stringVal: (value): value is string => typeof value === "string",
};

/** Base props for Inconsistent composit document loading */
const baseProps: Omit<InconsistentCompositeDocumentLoaderProps<S>, "path"> = {
  firestore,
  valuePredicates,
  handleChange: (data) =>
    console.log(__filename, `Data change in Inconsistent composite document`, {
      data,
      date: new Date().toLocaleString(),
    }),
};

const deleteDocument = async (path: string) => {
  await firestore.doc(path).delete();
  // pause for syncronisation
  return pause(100);
};

describe("InconsistentCompositeDocument", () => {
  it("can create, read, update, and delete composite documents to firestore", async () => {
    expect.hasAssertions();

    const path = `${rootPath}/NewComposite`;

    // assert document doesnt exist
    await deleteDocument(path);

    const docRef = firestore.doc(path);

    const props: InconsistentCompositeDocumentLoaderProps<S> = {
      ...baseProps,
      path,
    };

    const compositeDocument = await InconsistentCompositeDocument.load<S>(
      props
    );

    const objVal1 = { val1: "val1" };
    const objVal2 = { val1: "val2" };

    await compositeDocument.set("objVal", objVal1);
    await pause(300);

    // test newly created
    let snapshot = await docRef.get();
    expect(snapshot.exists).toBeTruthy();
    expect(snapshot.data()).toEqual<Record<"objVal", S["objVal"]>>({
      objVal: objVal1,
    });
    expect(compositeDocument.get("objVal")?.data).toEqual(objVal1);

    const stringVal = "string";

    // update in possible ways
    await compositeDocument.set("objVal", objVal2);
    await compositeDocument.get("boolVal")?.setValue(true);
    await compositeDocument.get("stringVal")?.setValue(stringVal);
    await pause(300);

    // test updated
    snapshot = await docRef.get();
    expect(snapshot.exists).toBeTruthy();
    expect(snapshot.data()).toEqual<S>({
      boolVal: true,
      objVal: objVal2,
      stringVal: stringVal,
    });
    expect(compositeDocument.get("objVal")?.data).toEqual(objVal2);
    expect(compositeDocument.get("boolVal")?.data).toEqual(true);
    expect(compositeDocument.get("stringVal")?.data).toEqual(stringVal);

    // delete in 2 ways
    await compositeDocument.get("objVal")?.delete();
    await compositeDocument.delete("boolVal");
    await compositeDocument.delete("stringVal");
    await pause(300);

    // test deleted
    snapshot = await docRef.get();
    expect(snapshot.exists).toBeTruthy();
    expect(snapshot.data()).toEqual({});
    expect(compositeDocument.get("objVal")?.data).toBeUndefined();
    expect(compositeDocument.get("boolVal")?.data).toBeUndefined();
    expect(compositeDocument.get("stringVal")?.data).toBeUndefined();

    compositeDocument.cleanUp();
  });
  /*
  it("can automatically load existing data from firestore", () => {
    expect.hasAssertions();
  });
  it("can accomodate sub documents with different schemas", () => {
    expect.hasAssertions();
  });
  */
});
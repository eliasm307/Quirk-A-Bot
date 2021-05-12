import { firestoreEmulator } from '../FirebaseExports';
import pause from '../utils/pause';
import ConsistentCompositeDocument, {
  ConsistentCompositeDocumentLoaderProps,
} from './ConsistentCompositeDocument';

const firestore = firestoreEmulator;

const rootPath = `DocumentGroupTests`;

type KeyType = "a" | "b" | "c";

interface ValueType {
  val1: string;
}

const keyPredicate = (key: unknown): key is KeyType => {
  return key === "a" || key === "b" || key === "c";
};

const valuePredicate = (value: unknown): value is ValueType => {
  const { val1 } = value as ValueType;
  return typeof val1 === "string";
};

/** Base props for consistent composite document loading */
const baseProps: Omit<
  ConsistentCompositeDocumentLoaderProps<KeyType, ValueType>,
  "path"
> = {
  firestore,
  keyPredicate,
  valuePredicate,
  handleChange: (data) =>
    console.log(__filename, `Data change in consistent composite document`, {
      data,
      date: new Date().toLocaleString(),
    }),
};

const deleteDocument = async (path: string) => {
  await firestore.doc(path).delete();
  // pause for synchronisation
  return pause(100);
};

describe("ConsistentCompositeDocument", () => {
  it("can create, read, update, and delete composite documents to firestore", async () => {
    expect.hasAssertions();

    const path = `${rootPath}/NewComposite`;

    // assert document doesn't exist
    await deleteDocument(path);

    const docRef = firestore.doc(path);

    const props: ConsistentCompositeDocumentLoaderProps<KeyType, ValueType> = {
      ...baseProps,
      path,
    };

    const compositeDocument = await ConsistentCompositeDocument.load<
      KeyType,
      ValueType
    >(props);

    await compositeDocument.set("a", { val1: "a" });
    await pause(300);

    // test newly created
    let snapshot = await docRef.get();
    expect(snapshot.exists).toBeTruthy();
    expect(snapshot.data()).toEqual<Record<"a", ValueType>>({
      a: { val1: "a" },
    });
    expect(compositeDocument.get("a")?.data).toEqual<ValueType>({ val1: "a" });

    // update in possible ways
    await compositeDocument.set("a", { val1: "b" });
    await compositeDocument.get("c")?.setValue({ val1: "c" });
    await pause(300);

    // test updated
    snapshot = await docRef.get();
    expect(snapshot.exists).toBeTruthy();
    expect(snapshot.data()).toEqual<Record<"a" | "c", ValueType>>({
      a: { val1: "b" },
      c: { val1: "c" },
    });
    expect(compositeDocument.get("a")?.data).toEqual<ValueType>({ val1: "b" });
    expect(compositeDocument.get("b")?.data).toEqual(undefined);
    expect(compositeDocument.get("c")?.data).toEqual<ValueType>({ val1: "c" });

    // delete in 2 ways
    await compositeDocument.get("a")?.delete();
    await compositeDocument.delete("b"); // can handle deleting item that doesn't exist
    await compositeDocument.delete("c");
    await pause(300);

    // test deleted
    snapshot = await docRef.get();
    expect(snapshot.exists).toBeTruthy();
    expect(snapshot.data()).toEqual({});
    expect(compositeDocument.get("a")?.data).toBeUndefined();
    expect(compositeDocument.get("b")?.data).toBeUndefined();
    expect(compositeDocument.get("c")?.data).toBeUndefined();

    compositeDocument.cleanUp();
  });
});

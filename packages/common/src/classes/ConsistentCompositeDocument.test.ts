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

const keyPredicate = (key: any): key is KeyType => {
  return key === "a" || key === "b" || key === "c";
};

const valuePredicate = (value: any): value is ValueType => {
  const { val1 } = value as ValueType;
  return typeof val1 === "string";
};

/** Base props for consistent composit document loading */
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
  // pause for syncronisation
  return pause(100);
};

describe("ConsistentCompositeDocument", () => {
  it("can delete sub documents from firestore", async () => {
    expect.hasAssertions();
  });
  it("can write and read new composite documents to firestore", async () => {
    expect.hasAssertions();

    const path = `${rootPath}/NewComposite`;

    // assert document doesnt exist
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

    await pause(100);

    let snapshot = await docRef.get();

    expect(snapshot.exists).toBeTruthy();
    expect(snapshot.data()).toEqual<Record<"a", ValueType>>({
      a: { val1: "a" },
    });
    expect(compositeDocument.get("a")).toEqual<Record<"a", ValueType>>({
      a: { val1: "a" },
    });

    compositeDocument.cleanUp();
  });
  it("can automatically load existing data from firestore", () => {
    expect.hasAssertions();
  });
  it("can accomodate sub documents with different schemas", () => {
    expect.hasAssertions();
  });
});

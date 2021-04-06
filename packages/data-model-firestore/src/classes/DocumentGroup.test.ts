import { firestoreEmulator } from '@quirk-a-bot/firebase-utils';

import DocumentGroup, { DocumentGroupProps } from './DocumentGroup';

const firestore = firestoreEmulator;

const rootPath = `DocumentGroupTests`;

type K = "a" | "b";

interface V {
  val1: string;
}

function dataPredicate(data: any): data is V {
  if (typeof data !== "object") return false;

  const { val1 } = data as V;

  return typeof val1 === "string";
}

describe("DocumentGroup", () => {
  it("can delete sub documents from firestore", () => {
    expect.hasAssertions();

    const props: DocumentGroupProps<K, V> = {
      path: `${rootPath}/CRUD`,
      firestore,
      dataPredicate,
      handleChange: (data) =>
        console.log(__filename, `Data change in document group`, { data }),
    };

    const docGroup = new DocumentGroup<K, V>(props);
  });
  it("can write documents to firestore", () => {
    expect.hasAssertions();
  });
  it("can automatically load existing data from firestore", () => {
    expect.hasAssertions();
  });
  it("can accomodate sub documents with different schemas", () => {
    expect.hasAssertions();
  });
});

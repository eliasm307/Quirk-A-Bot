import { firestoreEmulator } from '@quirk-a-bot/common';

import DocumentGroup, { DocumentGroupLoaderProps } from './DocumentGroup';

const firestore = firestoreEmulator;

const rootPath = `DocumentGroupTests`;

type KEY = "a" | "b";

interface VALUE {
  val1: string;
}

describe("DocumentGroup", () => {
  it("can delete sub documents from firestore", async () => {
    expect.hasAssertions();

    const props: DocumentGroupLoaderProps<KEY, VALUE> = {
      path: `${rootPath}/CRUD`,
      firestore,
      documentSchemaPredicate,
      handleChange: (data) =>
        console.log(__filename, `Data change in document group`, { data }),
    };

    const docGroup = await DocumentGroup.load<KEY, VALUE>(props);

    docGroup.get("a");

    docGroup.cleanUp();
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

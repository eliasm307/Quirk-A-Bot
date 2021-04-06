import { firestoreEmulator } from '@quirk-a-bot/firebase-utils';

import { GenericObject } from '../declarations/interfaces';
import DocumentGroup, { DocumentGroupLoaderProps } from './DocumentGroup';

const firestore = firestoreEmulator;

const rootPath = `DocumentGroupTests`;

type KEY = "a" | "b";

interface VALUE {
  val1: string;
}

function groupSchemaPredicate(data: any): data is GenericObject<KEY, VALUE> {
  if (typeof data !== "object") return false;

  const { val1 } = data as VALUE;

  return typeof val1 === "string";
}

describe("DocumentGroup", () => {
  it("can delete sub documents from firestore", async () => {
    expect.hasAssertions();

    const props: DocumentGroupLoaderProps<KEY, VALUE> = {
      path: `${rootPath}/CRUD`,
      firestore,
dataPredicate,
      handleChange: (data) =>
        console.log(__filename, `Data change in document group`, { data }),
    };

    const docGroup =  DocumentGroup.load<KEY, VALUE>(props);

    docGroup.
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

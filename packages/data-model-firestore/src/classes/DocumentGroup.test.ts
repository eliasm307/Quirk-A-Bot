import DocumentGroup, { DocumentGroupProps } from './DocumentGroup';

type K = "a" | "b";
interface V {
  val1: string;
}

describe("DocumentGroup", () => {
  it("can delete sub documents from firestore", () => {
    expect.hasAssertions();

    const props: DocumentGroupProps<K, V> = {};

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

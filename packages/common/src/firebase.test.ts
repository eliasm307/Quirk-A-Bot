import { firestoreEmulator, isFirestoreEmulatorRunning } from "./";

const testDocData = {
  testProperty: `testing @ ${new Date().toLocaleString()}`,
};
const testCollectionName = "testCollection";
const testDocumentName = "testDoc";

describe("firestore", () => {
  it("can write and read objects and arrays", async () => {
    expect.assertions(1);

    const data = {
      obj1: { child1: { prop: "i am a property", bool: false, num: 23 } },
      arr1: [
        { child: 1 },
        { another: { prop: { prop: 2, arr: [1, 2, 3, 4] } } },
      ],
      arr2: [1, 2, 3, true, "hi", "jj n"],
    };

    await firestoreEmulator.doc(`basicTests/${testDocumentName}`).set(data);

    const ref = await firestoreEmulator
      .doc(`basicTests/${testDocumentName}`)
      .get();

    const dataOut = ref.data();
    // console.warn(__filename, { dataOut, arr1Element1: data.arr1[1] });

    expect(data).toEqual(dataOut);
  });
});

describe("firestore emulator", () => {
  it("tests if firestore emulator is running", () => {
    if (!isFirestoreEmulatorRunning())
      throw Error("Firestore emulator not running");
    expect(isFirestoreEmulatorRunning()).toEqual(true);
  });

  it("can write to firestore documents", async () => {
    expect.assertions(1);
    await expect(
      firestoreEmulator
        .doc(`${testCollectionName}/${testDocumentName}`)
        .set(testDocData)
    ).resolves.toBeFalsy();
  });

  it("can read from firestore documents", async () => {
    expect.assertions(1);
    await expect(
      firestoreEmulator
        .doc(`${testCollectionName}/${testDocumentName}`)
        .get()
        .then((doc) => doc.data())
    ).resolves.toEqual(testDocData);
  });

  it("can read from firestore collections", async () => {
    expect.assertions(1);
    await expect(
      firestoreEmulator
        .collection(testCollectionName)
        .get()
        .then((col) => col.size)
    ).resolves.toBeGreaterThanOrEqual(1);
  });

  it("can delete items from firestore collections", async () => {
    expect.assertions(1);
    await expect(
      firestoreEmulator
        .doc(`${testCollectionName}/${testDocumentName}`)
        .delete()
    ).resolves.toBeFalsy();
  });

  it("can detect changes to firestore documents and collections", async () => {
    expect.assertions(6);

    const localTestCollectionName = `${testCollectionName}WithListener`;

    // make sure there is no existing data
    await firestoreEmulator
      .doc(`${localTestCollectionName}/${testDocumentName}`)
      .delete();

    await new Promise((res) => setTimeout(res, 500)); // wait for synchronisation

    // subscribe to document level changes
    const unsubscribeToDocument = firestoreEmulator
      .doc(`${localTestCollectionName}/${testDocumentName}`)
      .onSnapshot({
        next: (snapshot) => {
          const data: unknown = snapshot.data();
          // console.log('doc change', { data });
          if (snapshot.exists) {
            if (snapshot.metadata.hasPendingWrites) {
              // console.log('Modified document: ', { data });
              expect(data).toBeTruthy();
            } else {
              // console.log('snapshot has no pending writes', data);
            }
          } else {
            // console.log('snapshot does not exist, was this document deleted?', data);
            expect(data).toBeFalsy();
          }
        },
        error: console.error,
      });

    // console.log('document observer attached');

    // subscribe to collection level changes
    const unsubscribeToCollection = firestoreEmulator
      .collection(localTestCollectionName)
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const data = change.doc.data();

          if (!change.doc.exists)
            throw Error(
              `Document at path ${localTestCollectionName}/${change.doc.id} is marked as doesn't exist`
            );

          // todo use switch statement
          // logFirestoreChange(change, console.log);
          if (change.type === "added") {
            // console.log('New item: ', { data });
            expect(data).toEqual(testDocData);
          } else if (change.type === "modified") {
            // console.log('Modified document: ', { data });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(data.added).toBeTruthy();
          } else if (change.type === "removed") {
            // console.log('Removed document: ', { data });
            // pause for synchronisation then check deletion
            new Promise((res) => setTimeout(res, 50)).then(() => {
              expect(
                firestoreEmulator
                  .collection(localTestCollectionName)
                  .get()
                  .then((col) => expect(col.size).toEqual(0))
              );
            });
          }
        });
      });

    // console.log('collection observer attached');

    // assertion 1 & 2 (collection and document events)
    // console.log('creating document');
    await firestoreEmulator
      .doc(`${localTestCollectionName}/${testDocumentName}`)
      .set(testDocData);

    await new Promise((res) => setTimeout(res, 200)); // pause for synchronisation

    // assertion 3 & 4 (collection and document events)
    // console.log('updating document');
    await firestoreEmulator
      .doc(`${localTestCollectionName}/${testDocumentName}`)
      .update({ added: "something" });

    await new Promise((res) => setTimeout(res, 200)); // pause for synchronisation

    // assertion 5 & 6 (collection and document events)
    // console.log('deleting document');
    await firestoreEmulator
      .doc(`${localTestCollectionName}/${testDocumentName}`)
      .delete();

    await new Promise((res) => setTimeout(res, 200)); // pause for synchronisation

    // detach observers
    unsubscribeToCollection();
    unsubscribeToDocument();
    // console.log('observers detached');

    await new Promise((res) => setTimeout(res, 200)); // pause for synchronisation

    // these should not create any events on observer
    await firestoreEmulator
      .doc(`${localTestCollectionName}/${testDocumentName}`)
      .set(testDocData);
    await firestoreEmulator
      .doc(`${localTestCollectionName}/${testDocumentName}`)
      .update({ added: "something" });
    await firestoreEmulator
      .doc(`${localTestCollectionName}/${testDocumentName}`)
      .delete();
  });
});

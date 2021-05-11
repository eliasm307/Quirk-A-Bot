import { firestoreEmulator, pause } from '@quirk-a-bot/common';

import FirestoreCompositeDataStorageFactory from '../data-storage/FirestoreComposite/DataStorageFactory';
import GameController from './GameController';

const firestore = firestoreEmulator;

const dataStorageFactory = new FirestoreCompositeDataStorageFactory({
  firestore,
});

const ROOT_PATH = "GameFirestoreCompositeTests";

describe("Game with firestore composite data storage", () => {
  it("Can create and edit new games", async () => {
    const id = "createNewGame";

    const game = await GameController.load({
      id,
      dataStorageFactory,
      parentPath: ROOT_PATH,
    });

    const documentPath = dataStorageFactory.createPath(ROOT_PATH, id);

    await pause(200);

    const docRef = firestore.doc(documentPath);

    let firestoreData = (await docRef.get()).data();

    await expect(game.data()).resolves.toEqual(firestoreData);

    // update description and check result
    const description = "something";

    await game.update({ description });

    firestoreData = (await docRef.get()).data();

    await expect(game.data()).resolves.toEqual(firestoreData);
    expect(firestoreData?.description).toEqual(description);
  });
});

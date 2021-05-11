import { firestoreEmulator, pause } from '@quirk-a-bot/common';

import GameController from '../../game/GameController';
import FirestoreCompositeDataStorageFactory from './DataStorageFactory';

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

    const firestoreData = (await firestore.doc(documentPath).get()).data();

    await expect(game.data()).resolves.toEqual(firestoreData);
  });
});

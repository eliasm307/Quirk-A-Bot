import { firestoreEmulator, pause } from '@quirk-a-bot/common';

import FirestoreCompositeDataStorageFactory from '../data-storage/FirestoreComposite/DataStorageFactory';
import GameController from './GameController';
import { iGameData } from './interfaces/game-interfaces';

const firestore = firestoreEmulator;

const dataStorageFactory = new FirestoreCompositeDataStorageFactory({
  firestore,
});

const ROOT_PATH = "GameFirestoreCompositeTests";

describe("Game with firestore composite data storage", () => {
  it("Can create and edit new games", async () => {
    const id = "createNewGame";
    const documentPath = dataStorageFactory.createPath(ROOT_PATH, id);
    const docRef = firestore.doc(documentPath);

    const game = await GameController.load({
      id,
      dataStorageFactory,
      parentPath: ROOT_PATH,
    });

    await pause(200);

    let firestoreData = (await docRef.get()).data();

    await expect(game.data()).resolves.toEqual(firestoreData);

    // update description and check result
    const description = "something";

    await game.update({ description });

    firestoreData = (await docRef.get()).data();

    await expect(game.data()).resolves.toEqual(firestoreData);
    expect(firestoreData?.description).toEqual(description);
  });

  it("can initialise from existing data", async () => {
    const id = "existingNewGame";
    const documentPath = dataStorageFactory.createPath(ROOT_PATH, id);
    const docRef = firestore.doc(documentPath);

    await docRef.delete();

    await pause(500);

    const gameData: iGameData = {
      description: "an existing game",
      id,
      gameMasters: ["a guy", "another guy"],
      discordBotWebSocketServer: "www.some-site.com",
    };

    await docRef.set(gameData);

    await pause(500);

    const game = await GameController.load({
      dataStorageFactory,
      id,
      parentPath: ROOT_PATH,
    });

    await pause(500);

    expect((await docRef.get()).data()).toEqual(gameData);

    await expect(game.data()).resolves.toEqual(gameData);

    game.cleanUp();
  });
});

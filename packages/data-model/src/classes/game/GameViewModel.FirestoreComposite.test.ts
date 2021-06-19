import { CHARACTER_COLLECTION_NAME, firestoreEmulator, pause } from '@quirk-a-bot/common';

import isCharacterData from '../../utils/type-predicates/isCharacterData';
import FirestoreCompositeDataStorageFactory from '../data-storage/FirestoreComposite/DataStorageFactory';
import GameViewModel from './GameViewModel';
import { iGameData } from './interfaces/game-interfaces';
import { iCharacterData } from './interfaces/game-player-interfaces';
import defaultCharacterData from './utils/defaultCharacterData';

const firestore = firestoreEmulator;

const dataStorageFactory = new FirestoreCompositeDataStorageFactory({
  firestore,
});

const ROOT_PATH = "GameFirestoreCompositeTests";

const deleteGame = async (path: string) => {
  const characterCollectionPath = dataStorageFactory.createPath(
    path,
    CHARACTER_COLLECTION_NAME
  );

  // delete game characters
  const snapshot = await firestore.collection(characterCollectionPath).get();

  const deletePromises: Promise<void>[] = [];
  snapshot.forEach((docSnapshot) =>
    deletePromises.push(docSnapshot.ref.delete())
  );
  await Promise.all(deletePromises);

  // delete game
  const docRef = firestore.doc(path);
  await docRef.delete();
  await pause(500);
};

const loadGameCharactersData = async (
  gamePath: string
): Promise<iCharacterData[]> => {
  const characterCollectionPath = dataStorageFactory.createPath(
    gamePath,
    CHARACTER_COLLECTION_NAME
  );
  const characterCollectionRef = firestore.collection(characterCollectionPath);
  const charactersSnapshot = await characterCollectionRef.get();

  const firestoreCharacters: iCharacterData[] = [];

  charactersSnapshot.forEach((characterSnapshot) => {
    const characterData = characterSnapshot.data();

    if (!isCharacterData(characterData)) {
      const error = `Data is not valid character data`;
      console.error(error, { characterData });
      throw Error(error);
    }

    firestoreCharacters.push(characterData);
  });

  return firestoreCharacters;
};

describe("Game with firestore composite data storage", () => {
  afterAll(async () => firestore.app.delete());

  it("Can create and edit new games", async () => {
    const id = "createNewGame";
    const documentPath = dataStorageFactory.createPath(ROOT_PATH, id);

    await deleteGame(documentPath);

    const docRef = firestore.doc(documentPath);

    const game = await GameViewModel.load({
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

    await deleteGame(documentPath);

    const docRef = firestore.doc(documentPath);

    const gameData: iGameData = {
      description: "an existing game",
      id,
      gameMasterIds: ["a guy", "another guy"],
      discordBotWebSocketServer: "www.some-site.com",
      users: [],
    };

    await docRef.set(gameData);

    await pause(500);

    const game = await GameViewModel.load({
      dataStorageFactory,
      id,
      parentPath: ROOT_PATH,
    });

    await pause(500);

    expect((await docRef.get()).data()).toEqual(gameData);

    await expect(game.data()).resolves.toEqual(gameData);

    game.cleanUp();
  });

  it("Can add and remove characters", async () => {
    expect.hasAssertions();

    const id = "addRemoveCharacters";
    const documentPath = dataStorageFactory.createPath(ROOT_PATH, id);

    // const docRef = firestore.doc(documentPath);

    await deleteGame(documentPath);

    const game = await GameViewModel.load({
      dataStorageFactory,
      id,
      parentPath: ROOT_PATH,
    });

    // test adding characters
    const character1Id = "character1";
    const character2Id = "character2";

    await game.addCharacter(character1Id);
    await game.addCharacter(character2Id);

    let firestoreCharacters = await loadGameCharactersData(documentPath);
    let gameCharactersData = await game.getCharactersData();
    let gameData = await game.data();

    expect(firestoreCharacters.length).toEqual(2);
    expect(firestoreCharacters[0]).toEqual(
      defaultCharacterData(firestoreCharacters[0].id)
    );
    expect(firestoreCharacters[1]).toEqual(
      defaultCharacterData(firestoreCharacters[1].id)
    );
    expect(gameCharactersData.size).toEqual(2);
    // test synced ids
    expect(gameData.users.sort()).toEqual(
      firestoreCharacters.map((character) => character.id).sort()
    );

    // test deleting characters

    // delete character 2
    await game.removeCharacter(character2Id);

    firestoreCharacters = await loadGameCharactersData(documentPath);
    gameCharactersData = await game.getCharactersData();
    gameData = await game.data();

    expect(firestoreCharacters).toEqual([defaultCharacterData(character1Id)]);
    expect((await game.getCharactersData()).size).toEqual(1);
    expect(firestoreCharacters[0]).toEqual(
      gameCharactersData.get(character1Id)
    );
    expect(gameData.users.sort()).toEqual(
      firestoreCharacters.map((character) => character.id).sort()
    );

    // delete character1
    await game.removeCharacter(character1Id);

    firestoreCharacters = await loadGameCharactersData(documentPath);
    gameCharactersData = await game.getCharactersData();
    gameData = await game.data();

    expect(firestoreCharacters).toEqual([]);
    expect(gameCharactersData.size).toEqual(0);
    expect(gameData.users.sort()).toEqual(
      firestoreCharacters.map((character) => character.id).sort()
    );

    // todo adding characters should add the game id to user profile, set this as automated function
  }, 9999);

  it("detects game data changes and notifies subscriber", () => {
    expect.hasAssertions();
  });

  it("detects characters data changes and notifies subscriber", () => {
    expect.hasAssertions();
  });
});

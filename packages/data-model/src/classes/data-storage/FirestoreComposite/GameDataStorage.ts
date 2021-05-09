import path from 'node:path';

/* eslint-disable no-unreachable */
import {
  AbstractCompositeDocument, CHARACTER_COLLECTION_NAME, ConsistentCompositeDocument, Firestore,
  FirestoreCollectionReference, FirestoreDocumentReference, InconsistentCompositeDocument, isString,
} from '@quirk-a-bot/common';

import { CharacterSheet } from '../../..';
import { iCharacterSheet } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { iCharacterData } from '../../game/interfaces/game-player-interfaces';
import assertDocumentExistsOnFirestore from '../Firestore/utils/assertDocumentExistsOnFirestore';
import { iDataStorageFactory, iGameDataStorage } from '../interfaces/data-storage-interfaces';
import {
  iFirestoreCompositeCharacterSheetDataStorageProps,
} from '../interfaces/props/character-sheet-data-storage';
import { createPath } from '../utils/createPath';
import readGameDataFromFirestoreComposite from './utils/readGameData';
import writeGameDataToFirestoreComposite from './utils/writeGameData';

export default class FirestoreCompositeGameDataStorage
  implements iGameDataStorage {
  protected characterSheets?: Map<string, iCharacterSheet>;
  protected dataStorageFactory: iDataStorageFactory;
  protected firestore: Firestore;
  // this will be loaded when listener returns first results
  protected gameData?: iGameData;
  protected id: string;

  #characterCollectionRef: FirestoreCollectionReference;
  // this will be loaded when listener returns first results
  #characterData?: iCharacterData[];
  #compositeDocument: AbstractCompositeDocument<iGameData>;
  path: string;

  constructor(props: iFirestoreCompositeCharacterSheetDataStorageProps) {
    const { id, dataStorageFactory, firestore, parentPath } = props;
    this.id = id;
    this.path = createPath(parentPath, id);
    this.dataStorageFactory = dataStorageFactory;
    this.firestore = firestore;
    const characterCollectionPath = createPath(
      this.path,
      CHARACTER_COLLECTION_NAME
    );
    this.#characterCollectionRef = firestore.collection(
      characterCollectionPath
    );

    this.#characterCollectionRef.onSnapshot({
      next: (snapshot) => {
        const data = snapshot.docs.map((snapshot) => snapshot.data());

        const characters = data.filter(isCharacterData);
      },
    });

    this.#compositeDocument = InconsistentCompositeDocument.load<iGameData>({
      firestore,
      handleChange: ({ newData }) => {
        this.gameData = newData && { ...newData };
      },
      path: this.path,
      valuePredicates: {
        description: isString,
        discordBotWebSocketServer: (value): value is string | undefined =>
          typeof value === "undefined" || isString(value),
        gameMasters: Array.isArray,
        id: isString,
      },
    });
  }

  async addCharacter(id: string): Promise<void> {
    const charactersData = await this.getCharacters();

    if (charactersData.some((character) => character.id === id))
      return console.warn(
        "Cannot add character to game as they are already in the game"
      );

    const newCharacterData: iCharacterData = {
      id,
      img,
      name: DEFAUL,
    };

    // todo add default character data here
    this.#characterCollectionRef.doc(id).set(data, options);
  }

  // todo replace this with a load method instead?
  async assertDataExistsOnDataStorage(): Promise<void> {
    this.gameData = await assertDocumentExistsOnFirestore<iGameData>({
      firestore: this.firestore,
      path: this.path,
      // todo extract this to a static method or util
      newDefaultData: () => ({
        id: this.id,
        characterSheetIds: [],
        description: "",
        players: [],
        gameMasters: [],
      }),
      documentDataReader: readGameDataFromFirestoreComposite,
      documentDataWriter: writeGameDataToFirestoreComposite,
    });

    this.gameData = {
      id: this.id,
      description: "",
      gameMasters: [],
    };
  }

  async getCharacterSheets(): Promise<iCharacterSheet[]> {
    const characterSheetPromises = (await this.getCharacters()).map(
      (character) =>
        CharacterSheet.load({
          dataStorageFactory: this.dataStorageFactory,
          id: character.id,
          parentPath: this.path,
        })
    );

    return Promise.all(characterSheetPromises);
  }

  async getCharacters(): Promise<iCharacterData[]> {
    return this.#characterData;
  }

  async getData(): Promise<iGameData> {
    if (!this.gameData)
      throw Error(
        `Game data not loaded, please call assertDataExistsOnDataStorage before using this method`
      );

    return this.gameData;
  }

  setDescription(description: string): Promise<void> {}
}

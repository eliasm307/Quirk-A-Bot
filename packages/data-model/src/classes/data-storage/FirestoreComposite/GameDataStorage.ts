import {
  CHARACTER_COLLECTION_NAME, DEFAULT_CHARACTER_IMAGE_URL, DEFAULT_CHARACTER_NAME, Firestore,
  FirestoreCollectionReference, InconsistentCompositeDocument, isString, pause,
} from '@quirk-a-bot/common';

import isCharacterData from '../../../utils/type-predicates/isCharacterData';
import { iCharacterSheet } from '../../character-sheet/interfaces/character-sheet-interfaces';
import GameViewModel from '../../game/GameViewModel';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { iCharacterData } from '../../game/interfaces/game-player-interfaces';
import assertDocumentExistsOnFirestore from '../Firestore/utils/assertDocumentExistsOnFirestore';
import { iDataStorageFactory, iGameDataStorage } from '../interfaces/data-storage-interfaces';
import { iFirestoreCompositeGameDataStorageProps } from '../interfaces/props/game-data-storage';
import readGameDataFromFirestoreComposite from './utils/readGameData';
import writeGameDataToFirestoreComposite from './utils/writeGameData';

export default class FirestoreCompositeGameDataStorage
  implements iGameDataStorage
{
  // protected characterSheets?: Map<string, iCharacterSheet>;
  protected dataStorageFactory: iDataStorageFactory;
  protected firestore: Firestore;
  // this will be loaded when listener returns first results
  protected gameData?: iGameData;
  protected id: string;

  #characterCollectionRef: FirestoreCollectionReference;
  // this will be loaded when listener returns first results
  #characterData?: iCharacterData[];
  #compositeDocument: InconsistentCompositeDocument<iGameData>;
  #unsubscribeCharacterCollection: () => void;
  // characterData: Map<string, iCharacterData>;
  path: string;

  constructor(props: iFirestoreCompositeGameDataStorageProps) {
    const { id, dataStorageFactory, firestore, parentPath } = props;
    this.id = id;
    this.path = dataStorageFactory.createPath(parentPath, id);
    this.dataStorageFactory = dataStorageFactory;
    this.firestore = firestore;
    const characterCollectionPath = dataStorageFactory.createPath(
      this.path,
      CHARACTER_COLLECTION_NAME
    );
    this.#characterCollectionRef = firestore.collection(
      characterCollectionPath
    );

    // listen to character collection
    this.#unsubscribeCharacterCollection =
      this.#characterCollectionRef.onSnapshot({
        next: (collectionSnapshot) => {
          const data = collectionSnapshot.docs.map((documentSnapshot) =>
            documentSnapshot.data()
          );

          this.#characterData = data.filter(isCharacterData);
        },
        error: console.error,
      });

    // load and listen to game document
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
    const charactersData = await this.getCharacterData();

    if (charactersData.some((character) => character.id === id))
      return console.warn(
        "Cannot add character to game as they are already in the game"
      );

    // todo extract to util
    const newCharacterData: iCharacterData = {
      id,
      img: DEFAULT_CHARACTER_IMAGE_URL,
      name: DEFAULT_CHARACTER_NAME,
    };

    // add to local data
    this.#characterData = this.#characterData
      ? [...this.#characterData, newCharacterData]
      : [newCharacterData];

    // update on data storage
    await this.#characterCollectionRef.doc(id).set(newCharacterData);
  }

  // todo replace this with a load method instead?
  async assertDataExistsOnDataStorage(): Promise<void> {
    this.gameData = await assertDocumentExistsOnFirestore<iGameData>({
      firestore: this.firestore,
      path: this.path,
      // todo extract this to a static method or util
      newDefaultData: () => GameViewModel.defaultData(this.id),
      documentDataReader: readGameDataFromFirestoreComposite,
      documentDataWriter: writeGameDataToFirestoreComposite,
    });
  }

  cleanUp(): boolean {
    try {
      this.#unsubscribeCharacterCollection();
      this.#compositeDocument.cleanUp();
      return true;
    } catch (error) {
      console.error(`Error cleaning up game "${this.path}"`, error);
      return false;
    }
  }

  async getCharacterData(): Promise<iCharacterData[]> {
    return this.returnValueWhenLoaded(
      () => this.#characterData,
      "characters data"
    );
  }

  async data(): Promise<iGameData> {
    return this.returnValueWhenLoaded(() => this.gameData, "game data");
  }

  async setDescription(description: string): Promise<void> {
    await this.#compositeDocument.set("description", description);
  }

  async update(updates: Partial<Omit<iGameData, "id">>): Promise<void> {
    await this.#compositeDocument.update(updates);
  }

  private async returnValueWhenLoaded<T>(
    valueChecker: () => T | undefined,
    valueName: string
  ): Promise<T> {
    // if it is already defined return it
    let value = valueChecker();
    if (value) {
      console.log(
        __filename,
        `returnValueWhenLoaded, value already loaded, returning`,
        { value, valueName }
      );
      return value;
    }

    let counter = 0;
    const maxWaitTimeMs = 2000;
    const checkIntervalMs = 100;

    // if this is being called just after instantiation, need to wait for collection observer to do initial data load
    while (counter < maxWaitTimeMs / checkIntervalMs) {
      value = valueChecker();
      if (value) {
        console.log(`${valueName} loaded, returning now`);
        return value;
      }

      console.warn(
        `${valueName} was not defined, waiting ${checkIntervalMs}ms then checking again...`
      );

      // eslint-disable-next-line no-await-in-loop
      await pause(checkIntervalMs);
      counter++;
    }

    throw Error(
      `Could not get ${valueName} because character data did not load in given time frame`
    );
  }
}

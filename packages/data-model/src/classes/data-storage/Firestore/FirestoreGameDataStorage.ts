import { Firestore } from '@quirk-a-bot/common';

import { CharacterSheet } from '../../..';
import { iCharacterSheet } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { iCharacterData } from '../../game/interfaces/game-player-interfaces';
import { iDataStorageFactory, iGameDataStorage } from '../interfaces/data-storage-interfaces';
import {
  iFirestoreCharacterSheetDataStorageProps,
} from '../interfaces/props/character-sheet-data-storage';
import assertDocumentExistsOnFirestore from './utils/assertDocumentExistsOnFirestore';
import readGameDataFromFirestore from './utils/readGameDataFromFirestore';
import writeGameDataToFirestore from './utils/writeGameDataToFirestore';

export default class FirestoreGameDataStorage implements iGameDataStorage {
  protected characterSheets?: Map<string, iCharacterSheet>;
  protected dataStorageFactory: iDataStorageFactory;
  protected firestore: Firestore;
  protected gameData?: iGameData;
  protected id: string;

  path: string;

  constructor(props: iFirestoreCharacterSheetDataStorageProps) {
    const { id, dataStorageFactory, firestore, parentPath } = props;
    this.id = id;
    this.path = dataStorageFactory.createPath(parentPath, id);
    this.dataStorageFactory = dataStorageFactory;
    this.firestore = firestore;
  }

  addCharacter(id: string): Promise<void> {
    throw new Error("Method not implemented.");
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
      documentDataReader: readGameDataFromFirestore,
      documentDataWriter: writeGameDataToFirestore,
    });

    /*
    const characterSheetPromises = this.getCharacterIds().map((id) =>
      CharacterSheet.load({
        id,
        dataStorageFactory: this.dataStorageFactory,
        parentPath: this.path,
      })
    );
    */

    try {
      /*
      const characterSheetsArray = await Promise.all(characterSheetPromises);

      this.characterSheets = new Map(
        characterSheetsArray.map((characterSheet) => [
          characterSheet.id,
          characterSheet,
        ])
      );
      */
    } catch (error) {
      const errorDetail = {
        message: `Error loading character sheets for game with id ${this.id}`,
        error,
        __filename,
        gameData: this.gameData,
      };

      console.error(errorDetail);
      return Promise.reject(errorDetail);
    }
  }

  cleanUp(): boolean {
    throw new Error("Method not implemented.");
  }

  getCharacterData(): Promise<iCharacterData[]> {
    throw new Error("Method not implemented.");
  }

  async getData(): Promise<iGameData> {
    if (!this.gameData)
      throw Error(
        `Game data not loaded, please call assertDataExistsOnDataStorage before using this method`
      );

    return this.gameData;
  }

  updateData(props: Partial<Omit<iGameData, "id">>): Promise<iGameData> {
    throw new Error("Method not implemented.");
  }

  setDescription(description: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

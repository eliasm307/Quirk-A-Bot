import CharacterSheet from 'src/classes/character-sheet/CharacterSheet';

import { Firestore } from '@quirk-a-bot/firebase-utils';

import { iCharacterSheet } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iGameData } from '../../game/declarations/interfaces';
import { iDataStorageFactory, iGameDataStorage } from '../interfaces/data-storage-interfaces';
import { iFirestoreCharacterSheetDataStorageProps } from '../interfaces/props/game-data-storage';
import { createPath } from '../utils/createPath';
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
    this.path = createPath(parentPath, id);
    this.dataStorageFactory = dataStorageFactory;
    this.firestore = firestore;
  }

  // todo replace this with a load method instead?
  async assertDataExistsOnDataStorage(): Promise<void> {
    this.gameData = await assertDocumentExistsOnFirestore<iGameData>({
      firestore: this.firestore,
      path: this.path,
      newDefaultData: () => ({
        id: this.id,
        characterSheetIds: [],
        description: "",
        players: [],
      }),
      documentDataReader: readGameDataFromFirestore,
      documentDataWriter: writeGameDataToFirestore,
    });

    const characterSheetPromises = this.gameData.characterSheetIds.map((id) =>
      CharacterSheet.load({
        id,
        dataStorageFactory: this.dataStorageFactory,
        parentPath: this.path,
      })
    );

    try {
      const characterSheetsArray = await Promise.all(characterSheetPromises);

      this.characterSheets = new Map(
        characterSheetsArray.map((characterSheet) => [
          characterSheet.id,
          characterSheet,
        ])
      );
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

  getCharacterSheets(): Map<string, iCharacterSheet> {
    if (!this.characterSheets)
      throw Error(
        `Game character sheets not loaded, please call assertDataExistsOnDataStorage before using this method`
      );

    return this.characterSheets;
  }

  getData(): iGameData {
    if (!this.gameData)
      throw Error(
        `Game data not loaded, please call assertDataExistsOnDataStorage before using this method`
      );

    return this.gameData;
  }
}

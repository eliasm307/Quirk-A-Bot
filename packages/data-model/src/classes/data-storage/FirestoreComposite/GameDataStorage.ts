/* eslint-disable no-unreachable */
import { Firestore } from '@quirk-a-bot/common';

import { CharacterSheet } from '../../..';
import { iCharacterSheet } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iGameData } from '../../game/interfaces/game-interfaces';
import assertDocumentExistsOnFirestore from '../Firestore/utils/assertDocumentExistsOnFirestore';
import readGameDataFromFirestore from '../Firestore/utils/readGameDataFromFirestore';
import writeGameDataToFirestore from '../Firestore/utils/writeGameDataToFirestore';
import { iDataStorageFactory, iGameDataStorage } from '../interfaces/data-storage-interfaces';
import {
  iFirestoreCompositeCharacterSheetDataStorageProps,
} from '../interfaces/props/character-sheet-data-storage';
import { iFirestoreCharacterSheetDataStorageProps } from '../interfaces/props/game-data-storage';
import { createPath } from '../utils/createPath';

export default class FirestoreCompositeGameDataStorage
  implements iGameDataStorage {
  protected characterSheets?: Map<string, iCharacterSheet>;
  protected dataStorageFactory: iDataStorageFactory;
  protected firestore: Firestore;
  protected gameData?: iGameData;
  protected id: string;

  path: string;

  constructor(props: iFirestoreCompositeCharacterSheetDataStorageProps) {
    const { id, dataStorageFactory, firestore, parentPath } = props;
    this.id = id;
    this.path = createPath(parentPath, id);
    this.dataStorageFactory = dataStorageFactory;
    this.firestore = firestore;
  }

  // todo replace this with a load method instead?
  async assertDataExistsOnDataStorage(): Promise<void> {
    throw Error("Not implemented");
    /*
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
    */

    /*
    this.gameData = {
      id: this.id,
      characterSheetIds: [],
      description: "",
      players: [],
      gameMasters: [],
    };

    const characterSheetPromises = this.gameData?.characterSheetIds.map((id) =>
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
    */
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

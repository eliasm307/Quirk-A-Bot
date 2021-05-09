/* eslint-disable no-unreachable */
import { AbstractCompositeDocument, Firestore } from '@quirk-a-bot/common';

import { CharacterSheet } from '../../..';
import { iCharacterSheet } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iGameData } from '../../game/interfaces/game-interfaces';
import assertDocumentExistsOnFirestore from '../Firestore/utils/assertDocumentExistsOnFirestore';
import { iDataStorageFactory, iGameDataStorage } from '../interfaces/data-storage-interfaces';
import {
  iFirestoreCompositeCharacterSheetDataStorageProps,
} from '../interfaces/props/character-sheet-data-storage';
import { createPath } from '../utils/createPath';

export default class FirestoreCompositeGameDataStorage
  implements iGameDataStorage {
  protected characterSheets?: Map<string, iCharacterSheet>;
  protected dataStorageFactory: iDataStorageFactory;
  protected firestore: Firestore;
  protected gameData?: iGameData;
  protected id: string;

  #compositeDocument: AbstractCompositeDocument<iGameData>;
  description: string;
  path: string;

  constructor(props: iFirestoreCompositeCharacterSheetDataStorageProps) {
    const { id, dataStorageFactory, firestore, parentPath } = props;
    this.id = id;
    this.path = createPath(parentPath, id);
    this.dataStorageFactory = dataStorageFactory;
    this.firestore = firestore;
  }

  addCharacter(id: string): Promise<void> {}

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
      characterSheetIds: [],
      description: "",
      players: [],
      gameMasters: [],
    };
  }

  getCharacterIds(): string[] {}

  getCharacterSheets(): Promise<iCharacterSheet[]> {}

  getData(): iGameData {
    if (!this.gameData)
      throw Error(
        `Game data not loaded, please call assertDataExistsOnDataStorage before using this method`
      );

    return this.gameData;
  }

  setDescription(description: string): Promise<void> {}
}

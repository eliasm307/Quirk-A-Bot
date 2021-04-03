import { iHasParentPath } from 'packages/data-model/src/declarations/interfaces';

import { Firestore } from '@quirk-a-bot/firebase-utils/src';

import { iCharacterSheet } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iGameData } from '../../game/interfaces';
import {
  iDataStorageFactory, iGameDataStorage, iHasFirestore, iHasId,
} from '../interfaces/data-storage-interfaces';
import { iFirestoreCharacterSheetDataStorageProps } from '../interfaces/props/game-data-storage';
import { createPath } from '../utils/createPath';
import assertDocumentExistsOnFirestore from './utils/assertDocumentExistsOnFirestore';
import readCharacterSheetDataFromFirestore from './utils/readCharacterSheetDataFromFirestore';
import readGameDataFromFirestore from './utils/readGameDataFromFirestore';
import writeCharacterSheetDataToFirestore from './utils/writeCharacterSheetDataToFirestore';
import writeGameDataToFirestore from './utils/writeGameDataToFirestore';

export default class FirestoreGameDataStorage implements iGameDataStorage {
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
  }

  getCharacterSheets(): Map<string, iCharacterSheet> {}

  getData(): iGameData {}
}

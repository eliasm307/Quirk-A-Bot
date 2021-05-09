import { Firestore } from '@quirk-a-bot/common';

import CharacterSheet from '../../character-sheet/CharacterSheet';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import {
  iCharacterSheetDataStorage, iDataStorageFactory,
} from '../interfaces/data-storage-interfaces';
import {
  iFirestoreCharacterSheetDataStorageProps,
} from '../interfaces/props/character-sheet-data-storage';
import { createPath } from '../utils/createPath';
import assertDocumentExistsOnFirestore from './utils/assertDocumentExistsOnFirestore';
import readCharacterSheetDataFromFirestore from './utils/readCharacterSheetDataFromFirestore';
import writeCharacterSheetDataToFirestore from './utils/writeCharacterSheetDataToFirestore';

export default class FirestoreCharacterSheetDataStorage
  implements iCharacterSheetDataStorage {
  protected characterSheetData?: iCharacterSheetData;
  protected dataStorageFactory: iDataStorageFactory;
  protected firestore: Firestore;
  protected id: string;

  path: string;

  constructor({
    id,
    parentPath = "characterSheets",
    dataStorageFactory,
    firestore,
  }: iFirestoreCharacterSheetDataStorageProps) {
    this.id = id;
    this.path = createPath(parentPath, id);
    this.dataStorageFactory = dataStorageFactory;
    this.firestore = firestore;
  }

  async assertDataExistsOnDataStorage(): Promise<void> {
    this.characterSheetData = await assertDocumentExistsOnFirestore<iCharacterSheetData>(
      {
        firestore: this.firestore,
        path: this.path,
        newDefaultData: () => CharacterSheet.newDataObject({ id: this.id }),
        documentDataReader: readCharacterSheetDataFromFirestore,
        documentDataWriter: writeCharacterSheetDataToFirestore,
      }
    );
  }

  getData(): iCharacterSheetData {
    if (!this.characterSheetData)
      throw Error(
        'You need to call the method "assertDataExistsOnDataStorage" before getting the data'
      );

    // data type check is already done in assertDataExistsOnDataStorage so just return
    return this.characterSheetData;
  }
}

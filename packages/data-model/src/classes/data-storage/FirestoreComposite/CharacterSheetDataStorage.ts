import { Firestore } from '@quirk-a-bot/common';

import CharacterSheet from '../../character-sheet/CharacterSheet';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import assertDocumentExistsOnFirestore from '../Firestore/utils/assertDocumentExistsOnFirestore';
import writeCharacterSheetDataToFirestore from '../Firestore/utils/writeCharacterSheetDataToFirestore';
import {
  iCharacterSheetDataStorage, iDataStorageFactory,
} from '../interfaces/data-storage-interfaces';
import {
  iFirestoreCompositeCharacterSheetDataStorageProps,
} from '../interfaces/props/character-sheet-data-storage';
import readCharacterSheetDataFromFirestoreComposite from './utils/readCharacterSheetData';

export default class FirestoreCompositeCharacterSheetDataStorage
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
  }: iFirestoreCompositeCharacterSheetDataStorageProps) {
    this.id = id;
    this.path = dataStorageFactory.createPath(parentPath, id);
    this.dataStorageFactory = dataStorageFactory;
    this.firestore = firestore;
  }

  async assertDataExistsOnDataStorage(): Promise<void> {
    this.characterSheetData = await assertDocumentExistsOnFirestore<iCharacterSheetData>(
      {
        firestore: this.firestore,
        path: this.path,
        newDefaultData: () => CharacterSheet.newDataObject({ id: this.id }),
        documentDataReader: readCharacterSheetDataFromFirestoreComposite,
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

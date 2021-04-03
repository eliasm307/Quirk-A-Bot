import { Firestore } from '@quirk-a-bot/firebase-utils';

import CharacterSheet from '../../character-sheet/CharacterSheet';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import {
  iCharacterSheetDataStorage, iDataStorageFactory,
} from '../interfaces/data-storage-interfaces';
import {
  iFirestoreCharacterSheetDataStorageProps,
} from '../interfaces/props/trait-collection-data-storage';
import { createPath } from '../utils/createPath';
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
    // check character sheet exists
    const docPromise = this.firestore.doc(this.path).get();
    const docDataPromise = readCharacterSheetDataFromFirestore(
      this.firestore,
      this.path
    );

    try {
      const [doc, docData] = await Promise.all([docPromise, docDataPromise]);

      // ? is this required, this is done in readCharacterSheetDataFromFirestore
      /*
			if (doc.exists) {
				if (!isCharacterSheetData(docData)) {
					setTimeout((_: any) => {
						throw Error(`Data from document at path ${this.path} is not valid character sheet data`);
					});
					return;
				}
			}
			*/

      if (!doc.exists)
        throw Error(
          `Document at path ${this.path} does not exist, initialising it now`
        );
      this.characterSheetData = docData; // save data locally
    } catch (error) {
      console.warn(
        `Could not read character sheet data from path ${this.path}, initialising a new character sheet...`,
        { error }
      );
      // if it doesnt exist or data is bad, initialise it as a blank character sheet if not
      try {
        const data = CharacterSheet.newDataObject({ id: this.id });
        this.characterSheetData = CharacterSheet.newDataObject({ id: this.id }); // save data locally

        await writeCharacterSheetDataToFirestore(
          this.firestore,
          this.path,
          data
        );
      } catch (error) {
        console.error(__filename, { error });
        throw Error(
          `Could not initialise a new character sheet at path ${this.path}`
        );
      }
    }
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

import CharacterSheet from '../../character-sheet/CharacterSheet';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import {
  iCharacterSheetDataStorage, iDataStorageFactory,
} from '../interfaces/data-storage-interfaces';
import {
  iBaseCharacterSheetDataStorageProps,
} from '../interfaces/props/character-sheet-data-storage';

export default class InMemoryCharacterSheetDataStorage
  implements iCharacterSheetDataStorage {
  protected characterSheetData: iCharacterSheetData;
  protected dataStorageFactory: iDataStorageFactory;
  protected id: string;

  path: string;

  constructor({
    id = "DEFAULT",
    dataStorageFactory,
    parentPath,
  }: iBaseCharacterSheetDataStorageProps) {
    this.id = id;
    this.path = dataStorageFactory.createPath(parentPath, id);
    this.dataStorageFactory = dataStorageFactory;
    this.characterSheetData = CharacterSheet.newDataObject({ id: this.id }); // load data to local variable
  }

  async assertDataExistsOnDataStorage(): Promise<void> {
    // always uses new data so nothing to assert
  }

  getData(): iCharacterSheetData {
    return this.characterSheetData;
  }
}

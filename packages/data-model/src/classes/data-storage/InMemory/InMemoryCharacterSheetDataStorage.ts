import { iCharacterSheetData } from '../../../declarations/interfaces/character-sheet-interfaces';
import CharacterSheet from '../../CharacterSheet';
import {
	iBaseCharacterSheetDataStorageProps,
	iCharacterSheetDataStorage,
	iDataStorageFactory,
	iHasId,
} from './../../../declarations/interfaces/data-storage-interfaces';
export default class InMemoryCharacterSheetDataStorage implements iCharacterSheetDataStorage {
	protected id: string;
	protected dataStorageFactory: iDataStorageFactory;
	protected characterSheetData: iCharacterSheetData;
	constructor({ id = 'DEFAULT', dataStorageFactory }: iBaseCharacterSheetDataStorageProps) {
		this.id = id;
		this.dataStorageFactory = dataStorageFactory;
	}
	async assertDataExistsOnDataStorage(): Promise<void> {
		// load to local variable
		this.characterSheetData = CharacterSheet.newDataObject({ id: this.id });
		return;
	}
	getData(): iCharacterSheetData {
		return this.characterSheetData;
	}
}

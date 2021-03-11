import { iCharacterSheetData } from '../../../declarations/interfaces/character-sheet-interfaces';
import CharacterSheet from '../../CharacterSheet';
import {
	iBaseCharacterSheetDataStorageProps,
	iCharacterSheetDataStorage,
	iDataStorageFactory,
} from './../../../declarations/interfaces/data-storage-interfaces';

export default class InMemoryCharacterSheetDataStorage implements iCharacterSheetDataStorage {
	protected id: string;
	protected dataStorageFactory: iDataStorageFactory;
	protected characterSheetData: iCharacterSheetData;
	constructor({ id = 'DEFAULT', dataStorageFactory }: iBaseCharacterSheetDataStorageProps) {
		this.id = id;
		this.dataStorageFactory = dataStorageFactory;
		this.characterSheetData = CharacterSheet.newDataObject({ id: this.id }); // load data to local variable
	}
	async assertDataExistsOnDataStorage(): Promise<void> {
		// always uses new data so nothing to assert
		return;
	}
	getData(): iCharacterSheetData {
		return this.characterSheetData;
	}
}

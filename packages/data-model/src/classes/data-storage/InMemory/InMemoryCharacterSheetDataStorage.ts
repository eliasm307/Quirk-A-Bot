import { iCharacterSheetData } from '../../../declarations/interfaces/character-sheet-interfaces';
import { createPath } from '../../../utils/createPath';
import CharacterSheet from '../../CharacterSheet';
import {
	iBaseCharacterSheetDataStorageProps,
	iCharacterSheetDataStorage,
	iDataStorageFactory,
} from './../../../declarations/interfaces/data-storage-interfaces';

export default class InMemoryCharacterSheetDataStorage implements iCharacterSheetDataStorage {
	protected characterSheetData: iCharacterSheetData;
	protected dataStorageFactory: iDataStorageFactory;
	protected id: string;

	path: string;

	constructor({ id = 'DEFAULT', dataStorageFactory, parentPath }: iBaseCharacterSheetDataStorageProps) {
		this.id = id;
		this.path = createPath(parentPath, id);
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

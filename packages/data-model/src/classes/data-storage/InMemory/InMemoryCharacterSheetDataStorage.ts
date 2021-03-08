import { iCharacterSheet, iCharacterSheetData } from '../../../declarations/interfaces/character-sheet-interfaces';
import CharacterSheet from '../../CharacterSheet';
import {
	iBaseCharacterSheetDataStorageProps,
	iCanHaveId,
	iCharacterSheetDataStorage,
	iDataStorageFactory,
	iHasId,
} from './../../../declarations/interfaces/data-storage-interfaces';
export default class InMemoryCharacterSheetDataStorage implements iCharacterSheetDataStorage {
	protected id: string;
	protected dataStorageFactory: iDataStorageFactory;
	constructor({ id = 'DEFAULT', dataStorageFactory }: iBaseCharacterSheetDataStorageProps) {
		this.id = id;
		this.dataStorageFactory = dataStorageFactory;
	}
	get instance(): iCharacterSheet {
		return CharacterSheet.instances.has(this.id)
			? CharacterSheet.instances.get(this.id)!
			: new CharacterSheet({
					characterSheetData: this.getData(),
					dataStorageFactory: this.dataStorageFactory,
			  });
	}
	getData(): iCharacterSheetData {
		return CharacterSheet.newDataObject({ id: this.id });
	}
}

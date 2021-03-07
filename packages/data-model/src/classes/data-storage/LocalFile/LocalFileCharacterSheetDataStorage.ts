import path from 'path';
import { iCharacterSheet, iCharacterSheetData } from '../../../declarations/interfaces/character-sheet-interfaces';
import importDataFromFile from '../../../utils/importDataFromFile';
import { isCharacterSheetData } from '../../../utils/typePredicates';
import CharacterSheet from '../../CharacterSheet';
import {
	iBaseCharacterSheetDataStorageProps,
	iCharacterSheetDataStorage,
	iDataStorageFactory,
} from './../../../declarations/interfaces/data-storage-interfaces';

export default class LocalFileCharacterSheetDataStorage implements iCharacterSheetDataStorage {
	protected id: string;
	protected resolvedFilePath: string;
	protected dataStorageFactory: iDataStorageFactory;
	constructor({ id = `default/${Math.random() * 9}`, dataStorageFactory }: iBaseCharacterSheetDataStorageProps) {
		this.id = id;
		this.dataStorageFactory = dataStorageFactory;
		this.resolvedFilePath = path.resolve(__dirname, '../../../data/character-sheets/', id, '.json');
		console.warn(__filename, { id, resolvedFilePath: this.resolvedFilePath });
	}
	get instance(): iCharacterSheet {
		// check if an instance exists
		if (CharacterSheet.instances.has(this.resolvedFilePath)) {
			// console.log(__filename, `Using existing instance for '${resolvedPath}'`);
			return CharacterSheet.instances.get(this.resolvedFilePath) as CharacterSheet;
		}
		return new CharacterSheet({
			characterSheetData: this.getData(),
			dataStorageFactory: this.dataStorageFactory,
		});
	}
	getData(): iCharacterSheetData {
		// todo add option to create blank instance at the specified path if it doesnt exist?
		const data = importDataFromFile(this.resolvedFilePath);

		if (!data) throw Error(`Error importing data from ${this.resolvedFilePath}`);

		console.log(`Data imported from ${this.resolvedFilePath}`, { data });

		if (!isCharacterSheetData(data))
			throw Error(`Data loaded from path "${this.resolvedFilePath}" is not valid character sheet data`);

		return data;
	}
}

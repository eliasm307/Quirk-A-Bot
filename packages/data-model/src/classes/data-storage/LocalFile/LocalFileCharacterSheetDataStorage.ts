import path from 'path';
import { iCharacterSheet, iCharacterSheetData } from '../../../declarations/interfaces/character-sheet-interfaces';
import importDataFromFile from '../../../utils/importDataFromFile';
import { isCharacterSheetData } from '../../../utils/typePredicates';
import CharacterSheet from '../../CharacterSheet';
import {
	iBaseCharacterSheetDataStorageProps,
	iCharacterSheetDataStorage,
	iDataStorageFactory,
	iHasId,
	iLocalFileCharacterSheetDataStorageProps,
} from './../../../declarations/interfaces/data-storage-interfaces';
import fs from 'fs-extra';
import saveCharacterSheetToFile from '../../../utils/saveCharacterSheetToFile';

export default class LocalFileCharacterSheetDataStorage implements iCharacterSheetDataStorage {
	protected id: string;
	protected resolvedFilePath: string;
	protected dataStorageFactory: iDataStorageFactory;
	protected resolvedBasePath: string;
	constructor({
		id = `default/${Math.random() * 9}`,
		dataStorageFactory,
		resolvedBasePath,
	}: iLocalFileCharacterSheetDataStorageProps) {
		this.id = id;
		this.dataStorageFactory = dataStorageFactory;
		this.resolvedBasePath = resolvedBasePath;
		this.resolvedFilePath = path.resolve(resolvedBasePath, `${this.preProcessId(id)}.json`); 
	}

	private preProcessId(id: string) {
		return id.replace(/\.json$/i, '.json');
	}

	exists(): boolean {
		return fs.pathExistsSync(this.resolvedFilePath); // check file path exists
	}
	initialise(): boolean {
		return saveCharacterSheetToFile(CharacterSheet.newDataObject({ id: this.id }), this.resolvedFilePath);
	}
	/*
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
	}*/
	getData(): iCharacterSheetData {
		// todo add option to create blank instance at the specified path if it doesnt exist?
		const data = importDataFromFile(this.resolvedFilePath);

		if (!data) throw Error(`Error importing data from ${this.resolvedFilePath}`);

		// console.log(`Data imported from ${this.resolvedFilePath}`, { data });

		if (!isCharacterSheetData(data))
			throw Error(`Data loaded from path "${this.resolvedFilePath}" is not valid character sheet data`);

		return data;
	}
}
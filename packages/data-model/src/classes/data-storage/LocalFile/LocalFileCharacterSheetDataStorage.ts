import path from 'path';
import { iCharacterSheetData } from '../../../declarations/interfaces/character-sheet-interfaces';
import importDataFromFile from '../../../utils/importDataFromFile';
import { isCharacterSheetData } from '../../../utils/typePredicates';
import CharacterSheet from '../../CharacterSheet';
import {
	iCharacterSheetDataStorage,
	iDataStorageFactory,
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
	async assertDataExistsOnDataStorage(): Promise<void> {
		const exists = await fs.pathExistsSync(this.resolvedFilePath); // check file path exists

		if (exists) return;

		// if it doesnt exist initialise it as a blank character sheet
		await saveCharacterSheetToFile(CharacterSheet.newDataObject({ id: this.id }), this.resolvedFilePath);
	}

	private preProcessId(id: string) {
		return id.replace(/\.json$/i, '.json');
	}

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

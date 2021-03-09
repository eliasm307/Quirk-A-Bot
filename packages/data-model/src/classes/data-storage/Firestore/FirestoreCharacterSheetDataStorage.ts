import { Firestore } from './../../../utils/firebase';
import path from 'path';
import { iCharacterSheetData } from '../../../declarations/interfaces/character-sheet-interfaces';
import importDataFromFile from '../../../utils/importDataFromFile';
import { isCharacterSheetData } from '../../../utils/typePredicates';
import CharacterSheet from '../../CharacterSheet';
import {
	iCharacterSheetDataStorage,
	iDataStorageFactory,
	iFirestoreCharacterSheetDataStorageProps,
} from '../../../declarations/interfaces/data-storage-interfaces';
import fs from 'fs-extra';
import saveCharacterSheetToFile from '../../../utils/saveCharacterSheetToFile';

export default class FirestoreCharacterSheetDataStorage implements iCharacterSheetDataStorage {
	protected id: string;
	protected dataStorageFactory: iDataStorageFactory;
	protected firestore: Firestore;
	readonly #characterSheetCollectionName = 'CharacterSheets';

	#exists?: boolean ;

	constructor({
		id = `default/${Math.random() * 9}`,
		dataStorageFactory,
		firestore,
	}: iFirestoreCharacterSheetDataStorageProps) {
		this.id = id;
		this.dataStorageFactory = dataStorageFactory;
		this.firestore = firestore;
	}

	exists(): boolean {
		return this.firestore
			.collection(this.#characterSheetCollectionName)
			.doc(this.id)
			.get()
			.then();
	}
	async initialise(): Promise<boolean> {
		 
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

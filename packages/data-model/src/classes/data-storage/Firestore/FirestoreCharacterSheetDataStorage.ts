import { Firestore } from './../../../utils/firebase';
import { iCharacterSheetData } from '../../../declarations/interfaces/character-sheet-interfaces';
import { isCharacterSheetData } from '../../../utils/typePredicates';
import CharacterSheet from '../../CharacterSheet';
import {
	iCharacterSheetDataStorage,
	iDataStorageFactory,
	iFirestoreCharacterSheetDataStorageProps,
} from '../../../declarations/interfaces/data-storage-interfaces';
import { createPath } from '../../../utils/createPath';

export default class FirestoreCharacterSheetDataStorage implements iCharacterSheetDataStorage {
	protected id: string;
	protected dataStorageFactory: iDataStorageFactory;
	protected firestore: Firestore;
	protected path: string;
	readonly #characterSheetCollectionName = 'CharacterSheets';
	protected characterSheetData?: iCharacterSheetData;

	constructor({
		id = `default/${Math.random() * 9}`,
		dataStorageFactory,
		firestore,
	}: iFirestoreCharacterSheetDataStorageProps) {
		this.id = id;
		this.path = createPath(this.#characterSheetCollectionName, id);
		this.dataStorageFactory = dataStorageFactory;
		this.firestore = firestore;
	}
	async assertDataExistsOnDataStorage(): Promise<void> {
		// check character sheet exists
		const doc = await this.firestore.doc(this.path).get();

		if (doc.exists) {
			const data = doc.data();
			if (!isCharacterSheetData(data)) {
				throw Error(`Data from document at path ${this.path} is not valid character sheet data`);
			}

			this.characterSheetData = data; // save data locally
		} else {
			// if it doesnt exist initialise it as a blank character sheet if not
			try {
				const data = CharacterSheet.newDataObject({ id: this.id });
				await this.firestore.doc(this.path).set(data);
				this.characterSheetData = data; // save data locally
			} catch (error) {
				console.error(__filename, { error });
				throw Error(`Could not initialise a new character sheet at path ${this.path}`);
			}
		}
	}

	getData(): iCharacterSheetData {
		if (!this.characterSheetData)
			throw Error('You need to call the method "assertDataExistsOnDataStorage" before getting the data');

		// data type check is already done in assertDataExistsOnDataStorage so just return
		return this.characterSheetData;
	}
}

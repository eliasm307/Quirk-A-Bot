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
import writeCharacterSheetDataToFirestore from '../../../utils/writeCharacterSheetDataToFirestore';

export default class FirestoreCharacterSheetDataStorage implements iCharacterSheetDataStorage {
	protected id: string;
	protected dataStorageFactory: iDataStorageFactory;
	protected firestore: Firestore;
	protected path: string;
	protected characterSheetData?: iCharacterSheetData;

	constructor({
		id = `default/${Math.random() * 9}`,
		parentPath = 'characterSheets',
		dataStorageFactory,
		firestore,
	}: iFirestoreCharacterSheetDataStorageProps) {
		this.id = id;
		this.path = createPath(parentPath, id);
		this.dataStorageFactory = dataStorageFactory;
		this.firestore = firestore;
	}
	async assertDataExistsOnDataStorage(): Promise<void> {
		// check character sheet exists
		const doc = await this.firestore.doc(this.path).get();

		if (doc.exists) {
			const data = doc.data();
			if (!isCharacterSheetData(data)) {
				setTimeout((_: any) => {
					throw Error(`Data from document at path ${this.path} is not valid character sheet data`);
				});
				return;
			}

			this.characterSheetData = data; // save data locally
		} else {
			// if it doesnt exist initialise it as a blank character sheet if not
			try {
				const data = CharacterSheet.newDataObject({ id: this.id });
				this.characterSheetData = data; // save data locally

				// await this.firestore.doc(this.path).set(data); // ! this didnt write sub-collections but instead put them in as arrays in the same collection
				await writeCharacterSheetDataToFirestore(this.firestore, this.path, data);
			} catch (error) {
				console.error(__filename, { error });
				Promise.reject(new Error(`Could not initialise a new character sheet at path ${this.path}`));
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

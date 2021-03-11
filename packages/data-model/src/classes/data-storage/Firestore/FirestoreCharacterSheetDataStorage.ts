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
import readCharacterSheetDataFromFirestore from '../../../utils/readCharacterSheetDataFromFirestore';

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
		const docPromise = this.firestore.doc(this.path).get();
		const docDataPromise = readCharacterSheetDataFromFirestore(this.firestore, this.path);

		try {
			const [doc, docData] = await Promise.all([docPromise, docDataPromise]);

			// ? is this required, this is done in readCharacterSheetDataFromFirestore
			/*
			if (doc.exists) {
				if (!isCharacterSheetData(docData)) {
					setTimeout((_: any) => {
						throw Error(`Data from document at path ${this.path} is not valid character sheet data`);
					});
					return;
				}
			}
			*/
			// ? should this check if document exists?
			if (!doc.exists) throw Error(`Document at path ${this.path} does not exist, initialising it now`);
			this.characterSheetData = docData; // save data locally
		} catch (error) {
			console.warn(`Could not read character sheet data from path ${this.path}, initialising a new character sheet...`);
			// if it doesnt exist or data is bad, initialise it as a blank character sheet if not
			try {
				const data = CharacterSheet.newDataObject({ id: this.id });
				this.characterSheetData = data; // save data locally

				// await this.firestore.doc(this.path).set(data); // ! this didnt write sub-collections but instead put them in as arrays in the same collection
				await writeCharacterSheetDataToFirestore(this.firestore, this.path, data);
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

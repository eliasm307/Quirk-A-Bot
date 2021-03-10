import { iCharacterSheetData } from './../declarations/interfaces/character-sheet-interfaces';
import { createPath } from '../utils/createPath';
import { firestoreEmulator } from '../utils/firebase';
import { isCharacterSheetData } from '../utils/typePredicates';
import CharacterSheet from './CharacterSheet';
import FirestoreDataStorageFactory from './data-storage/Firestore/FirestoreDataStorageFactory';

const parentPath = 'characterSheetTestCollection';
const firestore = firestoreEmulator;
const dataStorageFactory = new FirestoreDataStorageFactory({ firestore });

const deleteDoc = async (path: string) => {
	await firestore.doc(path).delete();
	await new Promise(res => setTimeout(res, 100)); // wait for syncronisation

	// make sure document doesnt exist
	let doc = await firestore.doc(path).get();
	expect(doc.exists).toEqual(false);
	expect(doc.data()).toEqual(undefined);
};

describe('Character sheet using Firestore', () => {
	it('adds a new charactersheet to firestore', async () => {
		expect.hasAssertions();

		const csId = 'newCharacterSheet';
		const docPath = createPath(parentPath, csId);

		// delete any existing data
		await deleteDoc(docPath);

		// test intialising new cs
		const cs = await CharacterSheet.load({ dataStorageFactory, id: csId, parentPath });

		await new Promise(res => setTimeout(res, 100)); // wait for syncronisation

		// make sure document exists
		let doc = await firestore.doc(createPath(parentPath, csId)).get();
		const docData = doc.data();
		expect(doc.exists).toEqual(true);
		expect(isCharacterSheetData(docData)).toEqual(true);
		expect(doc.data()).toEqual(CharacterSheet.newDataObject({ id: csId }));
	});

	it('loads an existing charactersheet from firestore', async () => {
		expect.hasAssertions();

		const csId = 'existingCharacterSheet';
		const docPath = createPath(parentPath, csId);

		// delete any existing data
		await deleteDoc(docPath);

		const initialData: iCharacterSheetData = {
			id: csId,
			bloodPotency: { name: 'Blood Potency', value: 5 },
			health: { name: 'Health', value: 9 },
			humanity: { name: 'Humanity', value: 2 },
			hunger: { name: 'Hunger', value: 4 },
			willpower: { name: 'Willpower', value: 6 },
			name: { name: 'Name', value: 'test name' },
			sire: { name: 'Sire', value: 'some sire' },
			clan: { name: 'Clan', value: 'best clan' },
			attributes: [
				{ name: 'Charisma', value: 3 },
				{ name: 'Manipulation', value: 2 },
			],
			disciplines: [{ name: 'Blood Sorcery', value: 3 }],
			skills: [
				{ name: 'Academics', value: 2 },
				{ name: 'Brawl', value: 2 },
				{ name: 'Firearms', value: 4 },
			],
			touchstonesAndConvictions: [
				{ name: 'de ekidn', value: 'kdonoxc f f f ' },
				{ name: 'dfff', value: 'rvrrvrv  f f ff ' },
				{ name: 'ededed', value: 'kdonoxc  f f f f' },
			],
		};

		await firestore.doc(docPath).set(initialData);
		await new Promise(res => setTimeout(res, 100)); // wait for syncronisation

		// initialise cs
    const cs = await CharacterSheet.load( { dataStorageFactory, id: csId, parentPath } );
    
    const attributesCollection;
    const disciplinesCollection;
    const skillsCollection;
    const touchstonesAndConvictionsCollection;

    expect( cs.toJson() ).toEqual( initialData );
    



	});
});

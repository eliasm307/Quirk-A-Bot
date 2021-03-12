import {
  ATTRIBUTE_COLLECTION_NAME, DISCIPLINE_COLLECTION_NAME, SKILL_COLLECTION_NAME,
  TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME
} from '../../constants';
import { isCharacterSheetData } from '../../utils/typePredicates';
import FirestoreDataStorageFactory from '../data-storage/Firestore/FirestoreDataStorageFactory';
import { firestoreEmulator } from '../data-storage/Firestore/utils/firebase';
import readCharacterSheetDataFromFirestore from '../data-storage/Firestore/utils/readCharacterSheetDataFromFirestore';
import writeCharacterSheetDataToFirestore from '../data-storage/Firestore/utils/writeCharacterSheetDataToFirestore';
import { createPath } from '../data-storage/utils/createPath';
import CharacterSheet from './CharacterSheet';
import { iCharacterSheetData } from './interfaces/character-sheet-interfaces';

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
		let doc = await firestore.doc(docPath).get();
		const docData = await readCharacterSheetDataFromFirestore(firestore, docPath);

		expect(doc.exists).toEqual(true);
		expect(isCharacterSheetData(docData)).toEqual(true);
		expect(docData).toEqual(CharacterSheet.newDataObject({ id: csId }));
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

		// await firestore.doc(docPath).set(initialData);
		await writeCharacterSheetDataToFirestore(firestore, docPath, initialData);
		await new Promise(res => setTimeout(res, 500)); // wait for syncronisation

		// initialise cs
		const cs = await CharacterSheet.load({ dataStorageFactory, id: csId, parentPath });

		const attributesCollection = await firestore.collection(`${docPath}/${ATTRIBUTE_COLLECTION_NAME}`).get();
		const disciplinesCollection = await firestore.collection(`${docPath}/${DISCIPLINE_COLLECTION_NAME}`).get();
		const skillsCollection = await firestore.collection(`${docPath}/${SKILL_COLLECTION_NAME}`).get();
		const touchstonesAndConvictionsCollection = await firestore
			.collection(`${docPath}/${TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME}`)
			.get();

		const attributesData = attributesCollection.docs.map(doc => doc.data());
		const disciplinesData = disciplinesCollection.docs.map(doc => doc.data());
		const skillsData = skillsCollection.docs.map(doc => doc.data());
		const touchstonesAndConvictionsData = touchstonesAndConvictionsCollection.docs.map(doc => doc.data());

		expect(cs.toJson()).toEqual(initialData);
		expect(attributesData).toEqual(initialData.attributes);
		expect(disciplinesData).toEqual(initialData.disciplines);
		expect(skillsData).toEqual(initialData.skills);
		expect(touchstonesAndConvictionsData).toEqual(initialData.touchstonesAndConvictions);
	});
});

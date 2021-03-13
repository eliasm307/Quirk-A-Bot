import { DISCIPLINE_COLLECTION_NAME, SKILL_COLLECTION_NAME } from '../../../constants';
import { AttributeName, DisciplineName, SkillName } from '../../../declarations/types';
import isTraitData from '../../../utils/type-predicates/isTraitData';
import FirestoreDataStorageFactory from '../../data-storage/Firestore/FirestoreDataStorageFactory';
import { firestoreEmulator } from '../../data-storage/Firestore/utils/firebase';
import { iTraitCollectionFactoryMethodProps } from '../interfaces/trait-collection-interfaces';
import { iBaseTraitData } from '../interfaces/trait-interfaces';
import TraitFactory from '../TraitFactory';

// todo make these tests relevant

const firestore = firestoreEmulator;

const dataStorageFactory = new FirestoreDataStorageFactory({ firestore });

const rootCollectionPath = 'traitCollectionTests';

const createtraitCollectionFactoryMethodProps = (groupName: string): iTraitCollectionFactoryMethodProps => ({
	traitCollectionDataStorageInitialiser: dataStorageFactory.newTraitCollectionDataStorageInitialiser(),
	traitDataStorageInitialiser: dataStorageFactory.newTraitDataStorageInitialiser(),
	parentPath: `${rootCollectionPath}/${groupName}`,
	loggerCreator: null,
});

const deleteExistingCollectionDataAsync = async (collectionPath: string) => {
	// delete any existing data in the collection
	let collectionSnapshot = await firestore.collection(collectionPath).get();
	// if (collectionSnapshot.size) {
	try {
		await Promise.all(
			collectionSnapshot.docs.map(doc => {
				const docId = doc.id;

				return doc.ref.delete();
				// .then(() => console.log(`Deleted a trait from collection at path ${collectionPath} with id ${docId}`));
			})
		);
		return;
	} catch (error) {
		return Promise.reject(
			console.error(
				`Trait collection at path ${collectionPath} had some initial data, an error occured while deleting it`,
				{
					path: collectionPath,
					existingFirestoreData: collectionSnapshot.docs.map(doc => doc.data()),
					error,
				}
			)
		);
	}
	//	}
};

describe('TraitColleciton with Firestore data storage adding, and deleting', () => {
	it('adds traits to firestore collection', async () => {
		expect.hasAssertions();

		const props = createtraitCollectionFactoryMethodProps('testingCollectionFromBlankAdding');

		// NOTE firestore doesnt hold empty collecitons, no need to test when empty
		const tc = TraitFactory.newAttributeTraitCollection(props);

		// run tests after deleting any existing data
		await deleteExistingCollectionDataAsync(tc.path);

		// test adding traits
		tc.set('Charisma', 1).set('Composure', 2).set('Resolve', 3);
		const tcDataExpected: iBaseTraitData<AttributeName, number>[] = [
			{ name: 'Charisma', value: 1 },
			{ name: 'Composure', value: 2 },
			{ name: 'Resolve', value: 3 },
		];

		await new Promise(res => setTimeout(res, 1000)); // wait for syncronisation

		// get snapshot data
		let collectionSnapshot = await firestore.collection(tc.path).get();
		let collectionDocumentData = collectionSnapshot.docs.map(doc => doc.data());

		expect(collectionDocumentData.length).toEqual(3);
		expect(collectionSnapshot.size).toEqual(3);
		expect(collectionDocumentData.every(isTraitData)).toBe(true);
		expect(collectionDocumentData).toEqual(tcDataExpected);

		// can clean up
		expect(tc.cleanUp()).toEqual(true);
	});
	it('deletes traits from firestore collection', async () => {
		expect.hasAssertions();

		const props = createtraitCollectionFactoryMethodProps('testingCollectionFromBlankDeleting');

		// NOTE firestore doesnt hold empty collecitons, no need to test when empty
		const tc = TraitFactory.newAttributeTraitCollection(props);

		// run tests after deleting any existing data
		await deleteExistingCollectionDataAsync(tc.path);

		await new Promise(res => setTimeout(res, 200)); // wait for syncronisation

		// add some traits
		tc.set('Charisma', 1).set('Composure', 2).set('Resolve', 3);

		await new Promise(res => setTimeout(res, 200)); // wait for syncronisation

		// test deleting some items
		tc.delete('Charisma').delete('Composure');

		await new Promise(res => setTimeout(res, 200)); // wait for syncronisation

		// get snapshot data
		let collectionSnapshot = await firestore.collection(tc.path).get();
		let collectionDocumentData = collectionSnapshot.docs.map(doc => doc.data());

		expect(collectionSnapshot.size).toEqual(1);
		expect(collectionDocumentData.length).toEqual(1);
		expect(collectionDocumentData).toEqual([{ name: 'Resolve', value: 3 }]);

		// delete the rest of the items
		tc.delete('Resolve');
		await new Promise(res => setTimeout(res, 200)); // wait for syncronisation

		// get snapshot data
		collectionSnapshot = await firestore.collection(tc.path).get();
		collectionDocumentData = collectionSnapshot.docs.map(doc => doc.data());

		expect(collectionSnapshot.size).toEqual(0);
		expect(collectionDocumentData.length).toEqual(0);
		expect(collectionDocumentData).toEqual([]);

		// can clean up
		expect(tc.cleanUp()).toEqual(true);
	});

	it('cleans up', () => {
		expect.hasAssertions();

		const props = createtraitCollectionFactoryMethodProps('testingCollectionFromBlankCleanup');

		// NOTE firestore doesnt hold empty collecitons, no need to test when empty
		const tc = TraitFactory.newAttributeTraitCollection(props);

		// test cleanup
		expect(tc.cleanUp()).toEqual(true);
	});
});

describe('TraitColleciton with Firestore data storage', () => {
	it('can initialise a firestore colleciton from initial trait data', async () => {
		expect.hasAssertions();

		// name this test group path
		const props = createtraitCollectionFactoryMethodProps('testingCollectionFromExistingData');

		// delete any existing data
		await deleteExistingCollectionDataAsync(`${props.parentPath}/${SKILL_COLLECTION_NAME}`);

		const initialData: iBaseTraitData<SkillName, number>[] = [
			{ name: 'Academics', value: 1 },
			{ name: 'Animal Ken', value: 2 },
			{ name: 'Athletics', value: 3 },
		];

		// note uses different collection than other tests for different path
		const tc = TraitFactory.newSkillTraitCollection(props, ...initialData);

		await new Promise(res => setTimeout(res, 200)); // wait for syncronisation

		// get snapshot data
		let collectionSnapshot = await firestore.collection(tc.path).get();
		let collectionDocumentData = collectionSnapshot.docs.map(doc => doc.data());

		expect(collectionSnapshot.size).toEqual(3);
		expect(collectionDocumentData.length).toEqual(3);
		expect(collectionDocumentData).toEqual(initialData);

		// can clean up
		expect(tc.cleanUp()).toEqual(true);
	});

	it('listens to firestore and propagates changes to all trait collection instances', async () => {
		expect.hasAssertions();

		// name this test group path
		const props = createtraitCollectionFactoryMethodProps('testingEventListeners');
		const expectedPath = `${props.parentPath}/${DISCIPLINE_COLLECTION_NAME}`;

		// delete any existing data
		await deleteExistingCollectionDataAsync(expectedPath);

		await new Promise(res => setTimeout(res, 200)); // wait for syncronisation

		// note uses different collection than other tests for different path
		const tc1 = TraitFactory.newDisciplineTraitCollection(props);
		const tc2 = TraitFactory.newDisciplineTraitCollection(props);

		await new Promise(res => setTimeout(res, 200)); // wait for syncronisation

		// expect empty collections
		expect(tc1.path).toEqual(expectedPath);
		expect(tc2.path).toEqual(expectedPath);
		expect(tc1.size).toBe(0);
		expect(tc1.size == tc2.size).toBeTruthy();

		// make changes to collection 1
		tc1.set('Animalism', 1).set('Blood Sorcery', 2).set('Celerity', 3);
		await new Promise(res => setTimeout(res, 200)); // wait for syncronisation

		tc1.set('Celerity', 5);

		const resultingData: iBaseTraitData<DisciplineName, number>[] = [
			{ name: 'Animalism', value: 1 },
			{ name: 'Blood Sorcery', value: 2 },
			{ name: 'Celerity', value: 5 },
		];

		await new Promise(res => setTimeout(res, 200)); // wait for syncronisation

		// expect collection 2 to have the changes
		expect(tc2.size).toEqual(3);
		expect(tc2.data()).toEqual(tc1.data());
		expect(tc2.data()).toEqual(resultingData);

		// can clean up
		expect(tc1.cleanUp()).toEqual(true);
		expect(tc2.cleanUp()).toEqual(true);
	});
});

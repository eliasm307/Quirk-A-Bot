import { iBaseTraitData } from './../../declarations/interfaces/trait-interfaces';
import { firestoreEmulator } from './../../utils/firebase';
import { iTraitCollectionFactoryMethodProps } from '../../declarations/interfaces/trait-collection-interfaces';
import FirestoreTraitDataStorageFactory from '../data-storage/Firestore/FirestoreDataStorageFactory';
import TraitFactory from './TraitFactory';
import { isTraitData } from '../../utils/typePredicates';
import { AttributeName } from '../../declarations/types';

// todo make these tests relevant

const firestore = firestoreEmulator;

let testName: string;

const dataStorageFactory = new FirestoreTraitDataStorageFactory({ firestore });

const rootCollectionPath = 'traitCollectionTests/collections';

const traitCollectionFactoryMethodProps: iTraitCollectionFactoryMethodProps = {
	traitCollectionDataStorageInitialiser: dataStorageFactory.newTraitCollectionDataStorageInitialiser(),
	traitDataStorageInitialiser: dataStorageFactory.newTraitDataStorageInitialiser(),
	parentPath: rootCollectionPath,
};

// todo populate tests

describe('TraitColleciton with Firestore data storage adding, and deleting', () => {
	// NOTE firestore doesnt hold empty collecitons, no need to test when empty
	const tc = TraitFactory.newAttributeTraitCollection(traitCollectionFactoryMethodProps);

	const deleteExistingData = async () => {
		// delete any existing data in the collection
		let collectionSnapshot = await firestore.collection(tc.path).get();
		if (collectionSnapshot.size) {
			try {
				await Promise.all(
					collectionSnapshot.docs.map(doc => {
						const docId = doc.id;
						doc.ref
							.delete()
							.then(() => console.log(`Deleted a trait from collection at path ${tc.path} with id ${docId}`));
					})
				);
			} catch (error) {
				return Promise.reject(
					console.error(
						`Trait collection at path ${tc.path} had some initial data, an error occured while deleting it`,
						{ path: tc.path, existingFirestoreData: collectionSnapshot.docs.map(doc => doc.data()), error }
					)
				);
			}
		}
	};

	// run tests after deleting any existing data
	deleteExistingData()
		.then(() => {
			it('adds traits to firestore collection', async () => {
				expect.hasAssertions();

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

				expect(collectionSnapshot.size).toEqual(3);
				expect(collectionDocumentData.length).toEqual(3);
				expect(collectionDocumentData.every(isTraitData)).toBe(true);
				expect(collectionDocumentData).toEqual(tcDataExpected);
			});
			it('deletes traits from firestore collection', async () => {
				// test deleting some items
				tc.delete('Charisma').delete('Composure');
				await new Promise(res => setTimeout(res, 1000)); // wait for syncronisation

				// get snapshot data
				let collectionSnapshot = await firestore.collection(tc.path).get();
				let collectionDocumentData = collectionSnapshot.docs.map(doc => doc.data());

				expect(collectionSnapshot.size).toEqual(1);
				expect(collectionDocumentData.length).toEqual(1);
				expect(collectionDocumentData).toEqual([{ name: 'Resolve', value: 3 }]);

				// delete the rest of the items
				tc.delete('Resolve');
				await new Promise(res => setTimeout(res, 1000)); // wait for syncronisation

				// get snapshot data
				collectionSnapshot = await firestore.collection(tc.path).get();
				collectionDocumentData = collectionSnapshot.docs.map(doc => doc.data());

				expect(collectionSnapshot.size).toEqual(0);
				expect(collectionDocumentData.length).toEqual(0);
				expect(collectionDocumentData).toEqual([]);
			});

			it('cleans up', () => {
				// test cleanup
				expect(tc.cleanUp()).toEqual(true);
			});
		})
		.catch(console.error);
});

describe('TraitColleciton with Firestore data storage', () => {
	it('can initialise a firestore colleciton from initial trait data', () => {
		expect.hasAssertions();
	});

	it('listens to firestore and propagates changes to all trait collection instances', async () => {
		expect.hasAssertions();
	});
});

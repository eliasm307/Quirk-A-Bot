import { firestoreEmulator } from '../../utils/firebase';
import { isTraitData } from '../../utils/typePredicates';
import FirestoreDataStorageFactory from '../data-storage/Firestore/FirestoreDataStorageFactory';
import NumberTrait from './NumberTrait';

const firestore = firestoreEmulator;

const dataStorageFactory = new FirestoreDataStorageFactory({ firestore });
const traitDataStorageInitialiser = dataStorageFactory.newTraitDataStorageInitialiser();
const parentPath = 'NumberTrait-Firestore-test';

describe('Number trait with firestore data storage', () => {
	const trait1Name = 'trait1';

	const trait1 = new NumberTrait<string>({
		max: 10,
		name: trait1Name,
		value: 5.2,
		traitDataStorageInitialiser,
		parentPath,
	});

	it('asserts trait exists in firestore in the right format', async () => {
		expect.assertions(3);

		const doc = await firestore.doc(trait1.path).get();
		const data = doc.data();

		expect(doc.exists).toEqual(true);
		expect(isTraitData(data)).toEqual(true);
		expect(data).toEqual(trait1.toJson());
	});

	it('writes changes to firestore', async () => {
		expect.assertions(1);

		trait1.value = 0;
		trait1.value = 1;
		const doc = await firestore.doc(trait1.path).get();
		const data: any = doc.data();

		expect(data.value).toEqual(1);
	});

	it('allows linking trait instances to the same trait data', async () => {
		const knownValue = 0;

		// set trait to a known value
		trait1.value = knownValue;

		const trait2 = new NumberTrait<string>({
			max: 10,
			name: trait1Name,
			value: 5,
			traitDataStorageInitialiser,
			parentPath,
		});

		await new Promise(res => setTimeout(res, 1000)); // wait for syncronisation

		it('uses any existing value in firestore over the instance value', async () => {
			const doc1 = await firestore.doc(trait1.path).get();
			const doc2 = await firestore.doc(trait2.path).get();

			const doc1Data: any = doc1.data();
			const doc2Data: any = doc2.data();

			expect(doc1Data).toEqual(doc2Data);
			expect(doc2Data.value).toEqual(knownValue);
		});

		it('propagates changes to all trait instances', async () => {
			const initialValue = 0;
			const changeValue = 0;
			// set initial values
			trait1.value = initialValue;
			trait2.value = initialValue;

			await new Promise(res => setTimeout(res, 500)); // wait for syncronisation

			// change one trait
			trait1.value = changeValue;

			await new Promise(res => setTimeout(res, 500)); // wait for syncronisation

			// check if other trait syncronised
			expect(trait2.value).toEqual(changeValue);
		});
	});
});

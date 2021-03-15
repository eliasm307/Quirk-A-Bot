import { firestoreEmulator } from '@quirk-a-bot/firebase-utils';

import isTraitData from '../../../utils/type-predicates/isTraitData';
import FirestoreDataStorageFactory from '../../data-storage/Firestore/FirestoreDataStorageFactory';
import NumberTrait from './NumberTrait';

const firestore = firestoreEmulator;

const dataStorageFactory = new FirestoreDataStorageFactory({ firestore });
const traitDataStorageInitialiser = dataStorageFactory.newTraitDataStorageInitialiser();
const testSuiteParentPath = 'numberTrait-firestore';

describe('Number trait with firestore data storage', () => {
	it('asserts trait exists in firestore in the right format', async () => {
		const trait1Name = 'trait1';
		const testParentPath = testSuiteParentPath + '-trait-exists';

		const trait1 = new NumberTrait<string>({
			max: 10,
			name: trait1Name,
			value: 5.2,
			traitDataStorageInitialiser,
			parentPath: testParentPath,
			loggerCreator: null,
		});

		await new Promise(res => setTimeout(res, 100)); // wait for syncronisation

		const doc = await firestore.doc(trait1.path).get();
		const data = doc.data();

		expect.assertions(4);

		expect(doc.exists).toEqual(true);
		expect(isTraitData(data)).toEqual(true);
		expect(data).toEqual(trait1.data());

		// can clean up
		expect(trait1.cleanUp()).toEqual(true);
	}, 9999);

	it('writes changes to firestore', async () => {
		const trait1Name = 'trait1';
		const testParentPath = testSuiteParentPath + '-trait-writes';

		const trait1 = new NumberTrait<string>({
			max: 10,
			name: trait1Name,
			value: 5.2,
			traitDataStorageInitialiser,
			parentPath: testParentPath,
			loggerCreator: null,
		});

		await new Promise(res => setTimeout(res, 100)); // wait for syncronisation

		trait1.value = 0;
		trait1.value = 1;

		await new Promise(res => setTimeout(res, 100)); // wait for syncronisation

		const doc = await firestore.doc(trait1.path).get();
		const data: any = doc.data();

		expect.assertions(2);

		expect(data.value).toEqual(1);

		// can clean up
		expect(trait1.cleanUp()).toEqual(true);
	}, 9999);

	test('uses any existing value in firestore over the instance value', async () => {
		const trait1Name = 'trait1';
		const testParentPath = testSuiteParentPath + '-trait-init';

		const trait1 = new NumberTrait<string>({
			max: 10,
			name: trait1Name,
			value: 5.2,
			traitDataStorageInitialiser,
			parentPath: testParentPath,
			loggerCreator: null,
		});
		await new Promise(res => setTimeout(res, 100)); // wait for syncronisation

		const trait2 = new NumberTrait<string>({
			max: 10,
			name: trait1Name,
			value: 5,
			traitDataStorageInitialiser,
			parentPath: testParentPath,
			loggerCreator: null,
		});

		await new Promise(res => setTimeout(res, 100)); // wait for syncronisation

		const knownValue = 0;

		// set trait to a known value
		trait1.value = knownValue;

		await new Promise(res => setTimeout(res, 100)); // wait for syncronisation

		const doc1 = await firestore.doc(trait1.path).get();
		const doc2 = await firestore.doc(trait2.path).get();

		const doc1Data: any = doc1.data();
		const doc2Data: any = doc2.data();

		expect.assertions(4);

		expect(doc1Data).toEqual(doc2Data);
		expect(doc2Data.value).toEqual(knownValue);

		// can clean up
		expect(trait1.cleanUp()).toEqual(true);
		expect(trait2.cleanUp()).toEqual(true);
	});
	it('listens to firestore and propagates changes to all trait instances', async () => {
		const trait1Name = 'trait1';
		const testParentPath = testSuiteParentPath + '-trait-listeners';

		const initialValue = 0;
		const changeValue = 0;
		const trait1 = new NumberTrait<string>({
			max: 10,
			name: trait1Name,
			value: 5.2,
			traitDataStorageInitialiser,
			parentPath: testParentPath,
			loggerCreator: null,
		});

		await new Promise(res => setTimeout(res, 100)); // wait for syncronisation

		const trait2 = new NumberTrait<string>({
			max: 10,
			name: trait1Name,
			value: 5,
			traitDataStorageInitialiser,
			parentPath: testParentPath,
			loggerCreator: null,
		});

		await new Promise(res => setTimeout(res, 100)); // wait for syncronisation

		// set initial values
		trait1.value = initialValue;

		await new Promise(res => setTimeout(res, 100)); // wait for syncronisation

		trait2.value = initialValue;

		await new Promise(res => setTimeout(res, 100)); // wait for syncronisation

		// change one trait
		trait1.value = changeValue;

		await new Promise(res => setTimeout(res, 100)); // wait for syncronisation

		expect.assertions(3);
		// check if other trait syncronised
		expect(trait2.value).toEqual(changeValue);

		// can clean up
		expect(trait1.cleanUp()).toEqual(true);
		expect(trait2.cleanUp()).toEqual(true);
	});
});

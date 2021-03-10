import { firestoreEmulator } from './../../utils/firebase';
import { iTraitCollectionFactoryMethodProps } from '../../declarations/interfaces/trait-collection-interfaces';
import FirestoreTraitDataStorageFactory from '../data-storage/Firestore/FirestoreDataStorageFactory';

// todo make these tests relevant

const firestore = firestoreEmulator;

let testName: string;

const dataStorageFactory = new FirestoreTraitDataStorageFactory({ firestore });

const rootCollectionPath = 'traitCollectionTests';

const traitCollectionFactoryMethodProps: iTraitCollectionFactoryMethodProps = {
	traitCollectionDataStorageInitialiser: dataStorageFactory.newTraitCollectionDataStorageInitialiser(),
	traitDataStorageInitialiser: dataStorageFactory.newTraitDataStorageInitialiser(),
	parentPath: rootCollectionPath,
};

// todo populate tests
describe('TraitColleciton with Firestore data storage', () => {
	it('can initialise an empty firestore colleciton', () => {
		expect.hasAssertions();
	});
	it('can initialise a firestore colleciton from initial trait data', () => {
		expect.hasAssertions();
	});

	it('can add and remove traits to firestore collection', () => {
		expect.hasAssertions();
	});

	it('listens to firestore and propagates changes to all trait collection instances', async () => {
		expect.hasAssertions();
	});
});

import { iGeneralTrait } from '../../declarations/interfaces/trait-interfaces';
import { LogOperationUnion } from '../../declarations/types';
import TraitFactory from './TraitFactory';
import InMemoryTraitDataStorageFactory from '../data-storage/InMemory/InMemoryDataStorageFactory';
import { iTraitCollectionFactoryMethodProps } from '../../declarations/interfaces/trait-collection-interfaces';

// todo make these tests relevant

let testName: string;

const dataStorageFactory = new InMemoryTraitDataStorageFactory();

const rootCollectionPath = 'traitCollectionTests';

const traitCollectionFactoryMethodProps: iTraitCollectionFactoryMethodProps = {
	traitCollectionDataStorageInitialiser: dataStorageFactory.newTraitCollectionDataStorageInitialiser(),
	traitDataStorageInitialiser: dataStorageFactory.newTraitDataStorageInitialiser(),
	parentPath: rootCollectionPath,
};

describe( 'TraitColleciton with Firestore data storage', () => {
	it('can initialise an empty firestore colleciton', () => {});
	it('can initialise a firestore colleciton from initial trait data', () => {
	 
	} );

	it('can add and remove traits to firestore collection', () => {});
	

	it( 'listens to firestore and propagates changes to all trait collection instances', async () => { })

});

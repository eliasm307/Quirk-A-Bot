import InMemoryDataStorageFactory from '../../data-storage/InMemory/InMemoryDataStorageFactory';
import NumberTrait from './NumberTrait';

const dataStorageFactory = new InMemoryDataStorageFactory({});
const traitDataStorageInitialiser = dataStorageFactory.newTraitDataStorageInitialiser();
const parentPath = 'NumberTrait-InMemory-test';

// todo replace all jest "test" functions with "it" functions

describe('Number trait with in memory data storage', () => {
	const trait1 = new NumberTrait<string>({
		max: 10,
		name: 'numberTrait1',
		value: 5.2,
		traitDataStorageInitialiser,
		parentPath, 
		loggerCreator: null, 
	});
	const trait2 = new NumberTrait<string>({
		max: 10,
		name: 'numberTrait2',
		value: 5.8,
		traitDataStorageInitialiser,
		parentPath,
		loggerCreator: null,
	});
	it('rounds values on instantiation', () => {
		expect(trait1.value).toEqual(5);
		expect(trait2.value).toEqual(6);
	});

	it('rounds up values with a decimal portion equal to or greater than 0.5 on value modification', () => {
		trait1.value = 0.5; // trait 1 modification 1
		expect(trait1.value).toEqual(1);
	});

	it('rounds down values with a decimal portion less than 0.5 on modification', () => {
		trait1.value = 0.4; // trait 1 modification 2
		expect(trait1.value).toEqual(0);
	});

	it('does not accept any value modifications above or belows the defined limit', () => {
		trait1.value = 5; // trait 1 modification 3
		trait1.value = 11;
		trait1.value = -1;
		expect(trait1.value).toEqual(5);
	});

	it('logs modifications', () => {
		expect(trait1.log.events.length).toEqual(3);
	});
});

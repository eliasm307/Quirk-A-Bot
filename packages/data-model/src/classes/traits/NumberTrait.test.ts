import InMemoryDataStorageFactory from '../data-storage/InMemory/InMemoryDataStorageFactory';
import NumberTrait from './NumberTrait';

const dataStorageFactory = new InMemoryDataStorageFactory({});
const traitDataStorageInitialiser = dataStorageFactory.newTraitDataStorageInitialiser();
const parentPath = 'test';

test('Test rounding on instantiation and modification', () => {
	const trait = new NumberTrait<string>({
		max: 10,
		name: 'test',
		value: 5.2,
		traitDataStorageInitialiser,
		parentPath,
	});
	const trait2 = new NumberTrait<string>({
		max: 10,
		name: 'test',
		value: 5.8,
		traitDataStorageInitialiser,
		parentPath,
	});

	// test rounding at initialisation
	expect(trait.value).toEqual(5);
	expect(trait2.value).toEqual(6);

	// test round up on modification
	trait.value = 0.5;
	expect(trait.value).toEqual(1);

	// test round down on modification
	trait.value = 0.4;
	expect(trait.value).toEqual(0);

	// make sure trait logs are good
	expect(trait.getLogEvents().length).toEqual(3);
});

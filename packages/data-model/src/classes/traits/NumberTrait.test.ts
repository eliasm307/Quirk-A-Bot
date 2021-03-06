import InMemoryDataStorageFactory from '../data-storage/InMemoryDataStorageFactory';
import NumberTrait from './NumberTrait';

const dataStorageFactory = new InMemoryDataStorageFactory();
const traitDataStorageInitialiser = dataStorageFactory.newTraitDataStorageInitialiser();

test('Test rounding on instantiation and modification', () => {
	const trait = new NumberTrait<string>({
		max: 10,
		name: 'test',
		value: 5.2,
		traitDataStorageInitialiser, 
	});
	const trait2 = new NumberTrait<string>({
		max: 10,
		name: 'test',
		value: 5.8,
		traitDataStorageInitialiser, 
	});
	expect(trait.value).toEqual(5);
	expect(trait2.value).toEqual(6);

	trait.value = 0.5;
	expect(trait.value).toEqual(1);
});

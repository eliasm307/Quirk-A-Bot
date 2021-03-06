import { iInMemoryTraitDataStorageProps } from './../../declarations/interfaces/data-storage-interfaces';
import { LogOperationUnion } from '../../declarations/types';
import TraitCollection from './TraitCollection';
import { iAttribute } from '../../declarations/interfaces/trait-interfaces';
import TraitFactory from './TraitFactory';
import InMemoryTraitDataStorageFactory from '../data-storage/InMemory/InMemoryDataStorageFactory';

const saveAction = () => true;
let testName: string;

const dataStorageFactory = new InMemoryTraitDataStorageFactory();

test('traitCollection CRUD tests', () => {
	const tc = TraitFactory.newAttributeTraitCollection({ dataStorageFactory });

	// test size method
	expect(tc.size).toEqual(0);

	// test adding new item
	tc.set('Wits', 3);
	expect(tc.has('Wits')).toBeTruthy();
	expect(tc.has('Dexterity')).toBeFalsy();
	expect(tc.size).toEqual(1);

	// test changing existing item value
	tc.set('Wits', 2);
	expect(tc.has('Wits')).toBeTruthy();
	expect(tc.has('Dexterity')).toBeFalsy();
	expect(tc.size).toEqual(1);

	// test deleting entry that doesnt exist
	tc.delete('Dexterity');
	expect(tc.size).toEqual(1);

	// test deleting existing entry
	tc.delete('Wits');
	expect(tc.size).toEqual(0);
});

testName = 'traitCollection instantiation with initial data and logging';
test(testName, () => {
	const tc = TraitFactory.newAttributeTraitCollection({ dataStorageFactory });

	// add items
	tc.set('Wits', 3);
	tc.set('Charisma', 4);
	tc.set('Manipulation', 1);
	tc.set('Wits', 1);

	// expect atleast 3 items
	expect(tc.size).toBeGreaterThanOrEqual(3);

	const log = tc.getLogEvents();

	// console.log({ testName, log });

	// expect logs
	expect(log.length).toEqual(4);
	expect(log[0].operation).toEqual('ADD' as LogOperationUnion);
	expect(log[3].operation).toEqual('UPDATE' as LogOperationUnion);

	const count = tc.size;

	const traits = tc.toJson();

	// separate instance of same character sheet, no inital data
	const tc2 = TraitFactory.newAttributeTraitCollection({ dataStorageFactory });

	// no items expected
	expect(tc2.size).toEqual(0);

	// separate instance of same character sheet, with inital data
	const tc3 = TraitFactory.newAttributeTraitCollection({ dataStorageFactory }, ...tc.toJson());

	// same items as initial expected
	expect(tc3.size).toEqual(tc.size);
});

testName = 'trait test with toJson and log data';
test(testName, () => {
	const tc = TraitFactory.newAttributeTraitCollection({ dataStorageFactory });
	tc.set('Charisma', 3);

	console.log(__filename, { testName, tc });

	expect(tc.size).toBeGreaterThan(0);
	expect(tc.toJson().map(a => a.name)).toContain('Charisma');
	expect(tc.getLogReport().length).toBeGreaterThanOrEqual(1);
});

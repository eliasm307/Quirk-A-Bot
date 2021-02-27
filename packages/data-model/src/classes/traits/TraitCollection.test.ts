import { LogOperationUnion } from '../../declarations/types';
import TraitCollection from './TraitCollection';
import { iAttribute } from '../../declarations/interfaces/trait-interfaces';
import TraitFactory from './TraitFactory';

const saveAction = () => true;
let testName: string;

test('traitCollection CRUD tests', () => {
	const tc = new TraitCollection<iAttribute>({
		saveAction,
		instanceCreator: TraitFactory.newAttributeTrait,
	});

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
	const tc = new TraitCollection<iAttribute>({
		saveAction,
		instanceCreator: TraitFactory.newAttributeTrait,
	});

	// add items
	tc.set('Wits', 3);
	tc.set('Charisma', 4);
	tc.set('Manipulation', 1);
	tc.set('Wits', 1);

	// expect atleast 3 items
	expect(tc.size).toBeGreaterThanOrEqual(3);

	const log = tc.getLogData();

	// console.log({ testName, log });

	// expect logs
	expect(log[0].operation).toEqual('ADD' as LogOperationUnion);
	expect(log[3].operation).toEqual('UPDATE' as LogOperationUnion);

	const count = tc.size;

	const traits = tc.toJson();

	// separate instance of same character sheet, no inital data
	const tc2 = new TraitCollection<iAttribute>({
		saveAction,
		instanceCreator: TraitFactory.newAttributeTrait,
	});

	// no items expected
	expect(tc2.size).toEqual(0);

	// separate instance of same character sheet, with inital data
	const tc3 = new TraitCollection<iAttribute>(
		{
			saveAction,
			instanceCreator: TraitFactory.newAttributeTrait,
		},
		...tc.toJson()
	);

	// same items as initial expected
	expect(tc3.size).toEqual(tc.size);
});

testName = 'trait test with toJson and log data';
test(testName, () => {
	const tc = new TraitCollection<iAttribute>({
		instanceCreator: TraitFactory.newAttributeTrait,
	});
	tc.set('Charisma', 3);

	console.log(__filename, { testName, tc });

	expect(tc.size).toBeGreaterThan(0);
	expect(tc.toJson().map(a => a.name)).toContain('Charisma');
	expect(tc.getLogData().length).toBeGreaterThanOrEqual(1);
});

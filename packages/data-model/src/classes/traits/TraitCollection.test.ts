import { iGeneralTrait } from './../../declarations/interfaces/trait-interfaces';
import { LogOperationUnion } from '../../declarations/types';
import TraitFactory from './TraitFactory';
import InMemoryTraitDataStorageFactory from '../data-storage/InMemory/InMemoryDataStorageFactory';
import { iTraitCollectionFactoryMethodProps } from '../../declarations/interfaces/trait-collection-interfaces';

const saveAction = () => true;
let testName: string;

const dataStorageFactory = new InMemoryTraitDataStorageFactory({});

const parentPath = 'traitCollectionTests';

const traitCollectionFactoryMethodProps: iTraitCollectionFactoryMethodProps = {
	traitCollectionDataStorageInitialiser: dataStorageFactory.newTraitCollectionDataStorageInitialiser(),
	traitDataStorageInitialiser: dataStorageFactory.newTraitDataStorageInitialiser(),
	parentPath,
};

test('traitCollection CRUD tests', () => {
	const tc = TraitFactory.newAttributeTraitCollection(traitCollectionFactoryMethodProps);

	// test size method
	expect(tc.size).toEqual(0);

	// test adding new item
	tc.set('Wits', 3);
	expect(tc.has('Wits')).toBeTruthy();
	expect(tc.has('Dexterity')).toBeFalsy();
	expect(tc.size).toEqual(1);

	const trait = tc.get('Wits') as iGeneralTrait;
	expect(trait.path).toEqual(`${parentPath}/Wits`);

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
	const tc = TraitFactory.newAttributeTraitCollection(traitCollectionFactoryMethodProps);

	// add items using chaining
	tc.set('Wits', 3).set('Charisma', 4).set('Manipulation', 1).set('Wits', 1);

	// expect 3 items
	expect(tc.size).toEqual(3);

	// delete an existing item
	tc.delete('Wits');

	// delete non-existing items, should not generate log item
	tc.delete('Wits').delete('Composure').delete('Dexterity');

	// expect 2 items, 1 deleted
	expect(tc.size).toEqual(2);

	const log = tc.getLogEvents();

	console.log({ testName, log });

	// expect logs
	expect(log.length).toEqual(5); // ! when wits is deleted, this also deletes its logs,
	// todo maybe logging should be handled by a single top level object that distributes sub classes todo logging and report back to the master e.g. the charactersheet logger can produce traitCollection and trait loggers, and the traitCollection logger can produce trait loggers, all of which save a local record of logs but also report back any logs up the tree, benefit of this would be that logs are automatically sorted as they come in
	expect(log[0].operation).toEqual('ADD' as LogOperationUnion);
	expect(log[1].operation).toEqual('ADD' as LogOperationUnion);
	expect(log[2].operation).toEqual('ADD' as LogOperationUnion);
	expect(log[3].operation).toEqual('UPDATE' as LogOperationUnion);
	expect(log[4].operation).toEqual('DELETE' as LogOperationUnion);

	tc.delete('Charisma').delete('Manipulation');

	expect(tc.size).toEqual(0); // all items deleted
	expect(log.length).toEqual(7); // 2 new delete logs
	expect(log[5].operation).toEqual('DELETE' as LogOperationUnion);
	expect(log[6].operation).toEqual('DELETE' as LogOperationUnion);

	const count = tc.size;

	const traits = tc.toJson();

	// separate instance of same character sheet, no inital data
	const tc2 = TraitFactory.newAttributeTraitCollection(traitCollectionFactoryMethodProps);

	// no items expected
	expect(tc2.size).toEqual(0);

	// separate instance of same character sheet, with inital data
	const tc3 = TraitFactory.newAttributeTraitCollection(traitCollectionFactoryMethodProps, ...tc.toJson());

	// same items as initial expected
	expect(tc3.size).toEqual(tc.size);
});

testName = 'trait test with toJson and log data';
test(testName, () => {
	const tc = TraitFactory.newAttributeTraitCollection(traitCollectionFactoryMethodProps);
	tc.set('Charisma', 3);

	// console.log(__filename, { testName, tc });

	expect(tc.size).toBeGreaterThan(0);
	expect(tc.toJson().map(a => a.name)).toContain('Charisma');
	expect(tc.getLogReport().length).toBeGreaterThanOrEqual(1);
});

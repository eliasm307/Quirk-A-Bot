import { iGeneralTrait } from '../../declarations/interfaces/trait-interfaces';
import { LogOperationUnion } from '../../declarations/types';
import TraitFactory from './TraitFactory';
import InMemoryTraitDataStorageFactory from '../data-storage/InMemory/InMemoryDataStorageFactory';
import { iTraitCollectionFactoryMethodProps } from '../../declarations/interfaces/trait-collection-interfaces';

let testName: string;

const dataStorageFactory = new InMemoryTraitDataStorageFactory();

const rootCollectionPath = 'traitCollectionTests';

const traitCollectionFactoryMethodProps: iTraitCollectionFactoryMethodProps = {
	traitCollectionDataStorageInitialiser: dataStorageFactory.newTraitCollectionDataStorageInitialiser(),
	traitDataStorageInitialiser: dataStorageFactory.newTraitDataStorageInitialiser(),
	parentPath: rootCollectionPath,
};

describe('TraitCollection CRUD functionality', () => {
	const tc = TraitFactory.newAttributeTraitCollection(traitCollectionFactoryMethodProps);

	it('has initial size of 0', () => {
		expect(tc.size).toEqual(0);
	});

	it('can add traits to itself and keep track', () => {
		tc.set('Wits', 3);
		expect(tc.has('Wits')).toBeTruthy();
		expect(tc.has('Dexterity')).toBeFalsy();
		expect(tc.size).toEqual(1);
	});

	it('adds its name to the trait path', () => {
		expect((tc.get('Wits') as iGeneralTrait).path).toEqual(`${rootCollectionPath}/Attributes/Wits`);
	});

	it('can change existing trait values', () => {
		tc.set('Wits', 2);
		expect((tc.get('Wits') as iGeneralTrait).value).toEqual(2);
	});

	it('can handle requests to delete traits that dont exist from itself', () => {
		tc.delete('Dexterity');
		expect(tc.size).toEqual(1);
	});

	it('can delete existing traits from itself', () => {
		tc.delete('Wits');
		expect(tc.size).toEqual(0);
		expect(tc.has('Wits')).toEqual(false);
	});

	it('can add or edit items using chaining', () => {
		tc.set('Wits', 0).set('Dexterity', 0).set('Wits', 5);
		expect(tc.has('Wits')).toEqual(true);
		expect(tc.has('Dexterity')).toEqual(true);
		expect((tc.get('Wits') as iGeneralTrait).value).toEqual(5);
		expect((tc.get('Dexterity') as iGeneralTrait).value).toEqual(0);
		expect(tc.size).toEqual(2);
	});
});

describe('TraitCollection logging functionality', () => {
	const tc = TraitFactory.newAttributeTraitCollection(traitCollectionFactoryMethodProps);

	// create some log items

	// add items using chaining
	tc.set('Wits', 3).set('Charisma', 4).set('Manipulation', 1).set('Wits', 1);

	it('can produce log reports for all traits', () => {
		expect(tc.size).toEqual(4);
		expect(tc.getLogReports().length).toEqual(4);
	});

	// delete an existing item
	tc.delete('Wits');

	// delete non-existing items, should not generate log items
	tc.delete('Wits').delete('Composure').delete('Dexterity');

	const log = tc.getLogEvents();

	it('can count log items', () => {
		expect(log.length).toEqual(5); // ! when wits is deleted, this also deletes its logs,
		// todo maybe logging should be handled by a single top level object that distributes sub classes todo logging and report back to the master e.g. the charactersheet logger can produce traitCollection and trait loggers, and the traitCollection logger can produce trait loggers, all of which save a local record of logs but also report back any logs up the tree, benefit of this would be that logs are automatically sorted as they come in
	});

	it('produces log event details in order of time', () => {
		expect(log[0].operation).toEqual('ADD' as LogOperationUnion);
		expect(log[1].operation).toEqual('ADD' as LogOperationUnion);
		expect(log[2].operation).toEqual('ADD' as LogOperationUnion);
		expect(log[3].operation).toEqual('UPDATE' as LogOperationUnion);
		expect(log[4].operation).toEqual('DELETE' as LogOperationUnion);
	});

	// delete the rest of the traits, 2 new log items
	tc.delete('Charisma').delete('Manipulation');

	it('keeps logs after items are deleted', () => {
		expect(tc.size).toEqual(0); // all items deleted
		expect(log.length).toEqual(7); // 2 new delete logs
		expect(log[5].operation).toEqual('DELETE' as LogOperationUnion);
		expect(log[6].operation).toEqual('DELETE' as LogOperationUnion);
	});
});

describe('TraitCollection general functionality', () => {
	// separate instance of same character sheet, no inital data

	it('can export trait data', () => {
		const tc = TraitFactory.newAttributeTraitCollection(traitCollectionFactoryMethodProps);

		// create initial tc data
		const tcData = tc.set('Charisma', 1).set('Composure', 2).set('Dexterity', 3).set('Stamina', 4).toJson();
		expect(Array.isArray(tcData)).toEqual(true);
		expect(tcData.length).toEqual(4);
		expect(tcData[0].name).toEqual('Charisma');
		expect(tcData[2].name).toEqual('Dexterity');
		expect(tcData[3].name).toEqual('Stamina');

		expect(tcData[2].value).toEqual(3);
		expect(tcData[3].value).toEqual(4);
	});

	it('can be instantiated with existing data', () => {
		const tc = TraitFactory.newAttributeTraitCollection(traitCollectionFactoryMethodProps);

		// no items expected
		expect(tc.size).toEqual(0);

		// create initial tc data
		const tcData = tc.set('Charisma', 1).set('Composure', 2).set('Dexterity', 3).set('Stamina', 4).toJson();

		// separate instance of same character sheet, with inital data
		const tc2 = TraitFactory.newAttributeTraitCollection(traitCollectionFactoryMethodProps, ...tcData);
		expect(tc2.size).toEqual(4);
		expect((tc2.get('Charisma') as iGeneralTrait).value).toEqual(1);
		expect((tc2.get('Composure') as iGeneralTrait).value).toEqual(2);
		expect((tc2.get('Dexterity') as iGeneralTrait).value).toEqual(3);
		expect((tc2.get('Stamina') as iGeneralTrait).value).toEqual(4);
	});
});
/*
testName = 'trait test with toJson and log data';
test(testName, () => {
	const tc = TraitFactory.newAttributeTraitCollection(traitCollectionFactoryMethodProps);
	tc.set('Charisma', 3);

	// console.log(__filename, { testName, tc });

	expect(tc.size).toBeGreaterThan(0);

	expect(tc.getLogReports().length).toBeGreaterThanOrEqual(1);
});
*/

import { iBaseTraitData } from './../../declarations/interfaces/trait-interfaces';
import { iGeneralTrait } from '../../declarations/interfaces/trait-interfaces';
import { AttributeName, LogOperationUnion } from '../../declarations/types';
import TraitFactory from './TraitFactory';
import InMemoryDataStorageFactory from '../data-storage/InMemory/InMemoryDataStorageFactory';
import { iTraitCollectionFactoryMethodProps } from '../../declarations/interfaces/trait-collection-interfaces';

let testName: string;

const dataStorageFactory = new InMemoryDataStorageFactory();

const rootCollectionPath = 'traitCollectionTests';

const traitCollectionFactoryMethodProps: iTraitCollectionFactoryMethodProps = {
	traitCollectionDataStorageInitialiser: dataStorageFactory.newTraitCollectionDataStorageInitialiser(),
	traitDataStorageInitialiser: dataStorageFactory.newTraitDataStorageInitialiser(),
	parentPath: rootCollectionPath,
	logger: null,
};

test('TraitCollection CRUD functionality', () => {
	const tc = TraitFactory.newAttributeTraitCollection(traitCollectionFactoryMethodProps);

	// it('creates a path', () => {
	expect(tc.path).toEqual(`${rootCollectionPath}/Attributes`);

	// it('has initial size of 0', () => {
	expect(tc.size).toEqual(0);

	// it('can add traits to itself and keep track', () => {
	tc.set('Wits', 3);
	expect(tc.has('Wits')).toBeTruthy();
	expect(tc.has('Dexterity')).toBeFalsy();
	expect(tc.size).toEqual(1);

	// 	it('adds its name to the trait path', () => {
	expect((tc.get('Wits') as iGeneralTrait).path).toEqual(`${rootCollectionPath}/Attributes/Wits`);

	// it('can change existing trait values', () => {
	tc.set('Wits', 2);
	expect((tc.get('Wits') as iGeneralTrait).value).toEqual(2);

	// it('can handle requests to delete traits that dont exist from itself', () => {
	tc.delete('Dexterity');
	expect(tc.size).toEqual(1);

	// it('can delete existing traits from itself', () => {
	tc.delete('Wits');
	expect(tc.size).toEqual(0);
	expect(tc.has('Wits')).toEqual(false);

	// it('can add or edit items using chaining', () => {
	tc.set('Wits', 0).set('Dexterity', 0).set('Wits', 5);
	expect(tc.has('Wits')).toEqual(true);
	expect(tc.has('Dexterity')).toEqual(true);
	expect((tc.get('Wits') as iGeneralTrait).value).toEqual(5);
	expect((tc.get('Dexterity') as iGeneralTrait).value).toEqual(0);
	expect(tc.size).toEqual(2);
});

test('TraitCollection logging functionality', () => {
	// it('can produce log reports for all traits', () => {
	const tc = TraitFactory.newAttributeTraitCollection(traitCollectionFactoryMethodProps);

	// create some log items
	// add items using chaining
	tc.set('Wits', 3).set('Charisma', 4).set('Manipulation', 1).set('Wits', 1);
	expect(tc.size).toEqual(3);
	expect(tc.log.report.traitLogReports.length).toEqual(3);
	expect(tc.log.events.length).toEqual(4);

	// delete an existing item
	tc.delete('Wits');

	// delete non-existing items, should not generate log items
	tc.delete('Wits').delete('Composure').delete('Dexterity');

let logEventsSnapshot = tc.log.events;

	console.warn(__filename, { log: logEventsSnapshot });

	// it('can count log items', () => {
	expect(logEventsSnapshot.length).toEqual(5); // ! when wits is deleted, this also deletes its logs,
	// todo maybe logging should be handled by a single top level object that distributes sub classes todo logging and report back to the master e.g. the charactersheet logger can produce traitCollection and trait loggers, and the traitCollection logger can produce trait loggers, all of which save a local record of logs but also report back any logs up the tree, benefit of this would be that logs are automatically sorted as they come in

	// it('produces log event details in order of time', () => {
	expect(logEventsSnapshot[0].operation).toEqual('ADD' as LogOperationUnion);
	expect(logEventsSnapshot[1].operation).toEqual('ADD' as LogOperationUnion);
	expect(logEventsSnapshot[2].operation).toEqual('ADD' as LogOperationUnion);
	expect(logEventsSnapshot[3].operation).toEqual('UPDATE' as LogOperationUnion);
	expect(logEventsSnapshot[4].operation).toEqual('DELETE' as LogOperationUnion);

	// delete the rest of the traits, 2 new log items
	tc.delete('Charisma').delete('Manipulation');

   logEventsSnapshot = tc.log.events;

	// it('keeps logs after items are deleted', () => {
	expect(tc.size).toEqual(0); // all items deleted
	expect(logEventsSnapshot.length).toEqual(7); // 2 new delete logs
	expect(logEventsSnapshot[5].operation).toEqual('DELETE' as LogOperationUnion);
	expect(logEventsSnapshot[6].operation).toEqual('DELETE' as LogOperationUnion);
});

describe('TraitCollection general functionality', () => {
	// separate instance of same character sheet, no inital data

	it('can export trait data', () => {
		const tc = TraitFactory.newAttributeTraitCollection(traitCollectionFactoryMethodProps);

		// create initial tc data
		const tcData = tc.set('Charisma', 1).set('Composure', 2).set('Dexterity', 3).set('Stamina', 4).toJson();
		const tCDataExpected: iBaseTraitData<AttributeName, number>[] = [
			{ name: 'Charisma', value: 1 },
			{ name: 'Composure', value: 2 },
			{ name: 'Dexterity', value: 3 },
			{ name: 'Stamina', value: 4 },
		];
		expect(Array.isArray(tcData)).toEqual(true);
		expect(tcData.length).toEqual(4);
		expect(tcData).toEqual(tCDataExpected);
	});

	it('can be instantiated with existing data', () => {
		// create initial tc data
		const initialData: iBaseTraitData<AttributeName, number>[] = [
			{ name: 'Charisma', value: 1 },
			{ name: 'Composure', value: 2 },
			{ name: 'Dexterity', value: 3 },
			{ name: 'Stamina', value: 4 },
		];

		// separate instance of same character sheet, with inital data
		const tc2 = TraitFactory.newAttributeTraitCollection(traitCollectionFactoryMethodProps, ...initialData);
		expect(tc2.size).toEqual(4);
		expect((tc2.get('Charisma') as iGeneralTrait).value).toEqual(1);
		expect((tc2.get('Composure') as iGeneralTrait).value).toEqual(2);
		expect((tc2.get('Dexterity') as iGeneralTrait).value).toEqual(3);
		expect((tc2.get('Stamina') as iGeneralTrait).value).toEqual(4);
		expect(tc2.toJson()).toEqual(initialData);
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

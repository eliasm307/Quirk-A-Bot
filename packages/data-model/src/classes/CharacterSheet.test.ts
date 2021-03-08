import fs from 'fs-extra';
import path from 'path';
import CharacterSheet from './CharacterSheet';
import { iAttribute, iSkill, iTouchStoneOrConviction } from '../declarations/interfaces/trait-interfaces';
import LocalFileDataStorageFactory from './data-storage/LocalFile/LocalFileDataStorageFactory';
import InMemoryDataStorageFactory from './data-storage/InMemory/InMemoryDataStorageFactory';

// ids for test data
const newDataId = `character-sheet-test-new`;
const existingDataId = `character-sheet-test-existing`;

// base path for test data
const resolvedBasePath = path.resolve(__dirname, '../data/character-sheets/temporary/');

// resolved paths
const newDataResolvedPath = path.resolve(resolvedBasePath, `${newDataId}.json`);
const existingDataResolvedPath = path.resolve(resolvedBasePath, `${existingDataId}.json`);

if (fs.pathExistsSync(newDataResolvedPath)) {
	console.warn(__filename, `Deleting file "${newDataResolvedPath}" before testing`);
	fs.removeSync(newDataResolvedPath);
}

// const filePathRandom = path.resolve(__dirname, `../data/character-sheets/temporary/${testUserId}.json`);

const localDataStorageFactory = new LocalFileDataStorageFactory({ resolvedBasePath });
const inMemoryDataStorageFactory = new InMemoryDataStorageFactory({});

let testName: string;
/*
testName = 'loading from file that doesnt exist';
test(testName, () => {
	expect(() =>
		CharacterSheet.loadFromFile({
			filePath: path.resolve(__dirname, `../data/character-sheets/temporary/i-dont-exist.json`),
		})
	).toThrowError();
});*/

testName = 'save new blank character sheet and load the character sheet';
test(testName, () => {
	// creates new sheet and does initial save
	const cs: CharacterSheet = CharacterSheet.load({ dataStorageFactory: localDataStorageFactory, id: newDataId });

	const csLoaded: CharacterSheet = CharacterSheet.load({ dataStorageFactory: localDataStorageFactory, id: newDataId });

	// console.log({ testName, resolvedPath });

	// file should exist after save
	expect(fs.pathExistsSync(newDataResolvedPath)).toBe(true);

	// user id should be the same
	expect(csLoaded.id).toEqual(newDataId);

	// sheets should be the same
	expect(cs.toJson()).toEqual(csLoaded.toJson());
	expect(cs).toEqual(csLoaded);
});

testName = 'test new file, autosave and custom setters for basic data types';
test(testName, () => {
	const cs: CharacterSheet = CharacterSheet.load({ dataStorageFactory: localDataStorageFactory, id: newDataId });

	const cs2: CharacterSheet = CharacterSheet.load({ dataStorageFactory: localDataStorageFactory, id: newDataId });

	const testHealthValue = 1;
	const testBloodPotencyValue = 2;
	const testHungerValue = 3;

	// test changes with auto save
	cs.health.value = testHealthValue;
	cs.bloodPotency.value = testBloodPotencyValue;
	cs.hunger.value = testHungerValue;

	const csLoaded: CharacterSheet = CharacterSheet.load({ dataStorageFactory: localDataStorageFactory, id: newDataId });

	console.log({
		testName,
		healthLog1: csLoaded.health.getLogReport(),
		healthLog2: cs2.health.getLogReport(),
		health: csLoaded.health.toJson(),
		logEvents: cs.getLogEvents(),
		logReport: cs.getLogReport(),
	});

	// properties should be up to date on loaded instance
	expect(csLoaded.health.value).toEqual(testHealthValue);
	expect(csLoaded.bloodPotency.value).toEqual(testBloodPotencyValue);
	expect(csLoaded.hunger.value).toEqual(testHungerValue);

	// separate instance properties should be up to date // ? is this good?
	expect(cs2.health.value).toEqual(testHealthValue);
	expect(cs2.bloodPotency.value).toEqual(testBloodPotencyValue);
	expect(cs2.hunger.value).toEqual(testHungerValue);

	console.log({
		testName,
		logEvents: cs.getLogEvents(),
		logEvent1Time: cs.getLogEvents()[1]?.timeStamp,
		logEvent0TimeGetTime: cs.getLogEvents()[0]?.timeStamp,
		logEvent1TimeGetTime: cs.getLogEvents()[1]?.timeStamp,
		logEvent2TimeGetTime: cs.getLogEvents()[2]?.timeStamp,
	});

	// check changes were logged 
	expect(cs.getLogEvents()).toBeTruthy();
	expect(cs.getLogReport()).toBeTruthy();
	expect(csLoaded.health.getLogReport().logEvents.length).toEqual(1);
	expect(cs.getLogEvents().length).toEqual(3);
	expect(cs.getLogEvents()[0]?.property).toEqual('Health');
	expect(cs.getLogEvents()[1]?.property).toEqual('Blood Potency');
	expect(cs.getLogEvents()[2]?.property).toEqual('Hunger');

	// Changing values to same values should not generate more log items
	cs.health.value = testHealthValue;
	cs.bloodPotency.value = testBloodPotencyValue;
	cs.hunger.value = testHungerValue;

	expect(csLoaded.health.getLogReport().logEvents.length).toEqual(1);
	expect(cs.getLogEvents().length).toEqual(3);

	// add more log items
	csLoaded.health.value += 3;
	csLoaded.bloodPotency.value += 3;
	csLoaded.hunger.value += 3;
	/*
	console.log({
		testName,
		log1: csLoaded.getLogData(),
		log2: cs2.getLogData(),
	});*/

	// check changes were logged
	expect(csLoaded.health.getLogReport().logEvents.length).toBeGreaterThanOrEqual(2);
	expect(csLoaded.getLogReport()).toEqual(cs2.getLogReport());
});

testName = 'test existing file, autosave and custom setters for basic data types';
test(testName, () => {
	const cs: CharacterSheet = CharacterSheet.load({ dataStorageFactory: localDataStorageFactory, id: existingDataId });
	const cs2: CharacterSheet = CharacterSheet.load({ dataStorageFactory: localDataStorageFactory, id: existingDataId });

	const randVal = (min: number, max: number) => Math.random() * max + min;

	// test changes to values with random values, some logs should generate
	[cs.health, cs.bloodPotency, cs.hunger].forEach(trait => (trait.value = randVal(trait.min, trait.max)));

	const csLoaded: CharacterSheet = CharacterSheet.load({
		dataStorageFactory: localDataStorageFactory,
		id: existingDataId,
	});
/*
	console.log({
		testName,
		healthLog1: csLoaded.health.getLogReport(),
		healthLog2: cs2.health.getLogReport(),
		health: csLoaded.health.toJson(),
		logEvents: cs.getLogEvents(),
		logReport: cs.getLogReport(),
	});
	*/

	// some logs should exist 
	expect(cs.getLogEvents()).toBeTruthy();
	expect(cs.getLogReport()).toBeTruthy();
	expect(cs.getLogEvents().length).toBeGreaterThan(0);

	// check changes were logged
	expect(csLoaded.getLogReport()).toEqual(cs2.getLogReport());
});

// todo move these to trait collection tests
testName = 'test basic trait methods';
test(testName, () => {
	// console.log(`creating cs`);
	const cs: CharacterSheet = CharacterSheet.load({ dataStorageFactory: localDataStorageFactory, id: newDataId });

	// console.log(`setting strength`);
	cs.attributes.set('Strength', 5);

	// console.log(`setting Athletics`);
	cs.skills.set('Athletics', 3);

	// console.log(`setting touchstones/Conviction`);
	cs.touchstonesAndConvictions.set('a custom one', 'something, something, something');

	expect(cs.attributes.get('Strength')).toBeTruthy();
	expect((cs.attributes.get('Strength') as iAttribute).value).toEqual(5);
	expect((cs.skills.get('Athletics') as iSkill)?.value).toEqual(3);
	expect((cs.touchstonesAndConvictions.get('a custom one') as iTouchStoneOrConviction)?.value).toEqual(
		'something, something, something'
	);
});

import fs from 'fs-extra';
import path from 'path';
import CharacterSheet from './CharacterSheet';
import { iAttribute, iSkill, iTouchStoneOrConviction } from '../declarations/interfaces/trait-interfaces';
import LocalFileDataStorageFactory from './data-storage/LocalFile/LocalFileDataStorageFactory';
import InMemoryDataStorageFactory from './data-storage/InMemory/InMemoryDataStorageFactory';

// todo use a constant file name that gets deleted before each test
const testUserId = `character-sheet-test`;
const resolvedBasePath = path.resolve(__dirname, '../data/character-sheets/temporary/');
const resolvedPath = path.resolve(resolvedBasePath, `${testUserId}.json`);
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
	const cs: CharacterSheet = CharacterSheet.load({ dataStorageFactory: localDataStorageFactory, id: testUserId });

	const csLoaded: CharacterSheet = CharacterSheet.load({ dataStorageFactory: localDataStorageFactory, id: testUserId });

	// console.log({ testName, resolvedPath });

	// file should exist after save
	expect(fs.pathExistsSync(resolvedPath)).toBe(true);

	// user id should be the same
	expect(csLoaded.id).toEqual(testUserId);

	// sheets should be the same
	expect(cs.toJson()).toEqual(csLoaded.toJson());
	expect(cs).toEqual(csLoaded);
});

testName = 'test autosave and custom setters for basic data types';
test(testName, () => {
	const cs: CharacterSheet = CharacterSheet.load({ dataStorageFactory: localDataStorageFactory, id: testUserId });

	const cs2: CharacterSheet = CharacterSheet.load({ dataStorageFactory: localDataStorageFactory, id: testUserId });

	const testHealthValue = 1;
	const testBloodPotencyValue = 2;
	const testHungerValue = 3;

	// test changes with auto save
	cs.health.value = testHealthValue;
	cs.bloodPotency.value = testBloodPotencyValue;
	cs.hunger.value = testHungerValue;

	const csLoaded: CharacterSheet = CharacterSheet.load({ dataStorageFactory: localDataStorageFactory, id: testUserId });

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
	// todo make sure logs are tested, there should be a method to get all logs of a character sheet
	expect(csLoaded.health.getLogReport().logEvents.length).toBeGreaterThanOrEqual(1);
	expect(cs.getLogEvents().length).toEqual(3);
	expect(cs.getLogEvents()[0]?.property).toEqual('Health');
	expect(cs.getLogEvents()[1]?.property).toEqual('Blood Potency');
	expect(cs.getLogEvents()[2]?.property).toEqual('Hunger');

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

testName = 'test basic trait methods';
test(testName, () => {
	// console.log(`creating cs`);
	const cs: CharacterSheet = CharacterSheet.load({ dataStorageFactory: localDataStorageFactory, id: testUserId });

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

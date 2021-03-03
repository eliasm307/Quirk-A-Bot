import fs from 'fs-extra';
import path from 'path';
import CharacterSheet from './CharacterSheet';
import { iAttribute, iSkill, iTouchStoneOrConviction } from '../declarations/interfaces/trait-interfaces';

// todo use test utils
const testUserId = Math.floor(Math.random() * 9);
const filePathRandom = path.resolve(__dirname, `../data/character-sheets/temporary/${testUserId}.json`);

let testName: string;

testName = 'save new blank character sheet and load the character sheet';
test(testName, () => {
	// creates new sheet and does initial save
	const cs = new CharacterSheet(testUserId, filePathRandom);

	const csLoaded = CharacterSheet.loadFromFile({ filePath: filePathRandom });

	// console.log({ testName, testUserId, filePath, cs, csLoaded });

	// file should exist after save
	expect(fs.pathExistsSync(filePathRandom)).toBe(true);

	// user id should be the same
	expect(csLoaded.discordUserId).toEqual(testUserId);

	// sheets should be the same
	expect(cs.toJson()).toEqual(csLoaded.toJson());
});

testName = 'test autosave and custom setters for basic data types';
test(testName, () => {
	const cs = CharacterSheet.loadFromFile({ filePath: filePathRandom });

	const cs2 = CharacterSheet.loadFromFile({ filePath: filePathRandom });

	const testHealthValue = 1;
	const testBloodPotencyValue = 2;
	const testHungerValue = 3;

	// test changes with auto save
	cs.health.value = testHealthValue;
	cs.bloodPotency.value = testBloodPotencyValue;
	cs.hunger.value = testHungerValue;

	const csLoaded = CharacterSheet.loadFromFile({ filePath: filePathRandom });

	console.log({
		testName,
		healthLog1: csLoaded.health.getLogReport(),
		healthLog2: cs2.health.getLogReport(),
		health: csLoaded.health.toJson(),
	});

	// properties should be up to date on loaded instance
	expect(csLoaded.health.value).toEqual(testHealthValue);
	expect(csLoaded.bloodPotency.value).toEqual(testBloodPotencyValue);
	expect(csLoaded.hunger.value).toEqual(testHungerValue);

	// separate instance properties should be up to date // ? is this good?
	expect(cs2.health.value).toEqual(testHealthValue);
	expect(cs2.bloodPotency.value).toEqual(testBloodPotencyValue);
	expect(cs2.hunger.value).toEqual(testHungerValue);

	// check changes were logged
	// todo make sure logs are tested, there should be a method to get all logs of a character sheet
	expect(csLoaded.health.getLogReport().logEvents.length).toBeGreaterThanOrEqual(1);

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
	const cs = CharacterSheet.loadFromFile({ filePath: filePathRandom });

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

// todo test what happens if file doesnt exist

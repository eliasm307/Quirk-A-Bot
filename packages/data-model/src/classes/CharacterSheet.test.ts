import { iTouchStoneOrConviction } from './../declarations/interfaces';
import fs from 'fs-extra';
import path from 'path';
import { iAttribute, iSkill } from '../declarations/interfaces';
import CharacterSheet from './CharacterSheet';

const testUserId = Math.floor(Math.random() * 999999);
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
	expect(cs).toEqual(csLoaded);
});

testName = 'test autosave and custom setters for basic data types';
test(testName, () => {
	const cs = CharacterSheet.loadFromFile({ filePath: filePathRandom });

	const cs2 = CharacterSheet.loadFromFile({ filePath: filePathRandom });

	const testHealthValue = 1;
	const testBloodPotencyValue = 2;
	const testHungerValue = 3;

	// test changes with auto save
	cs.health = testHealthValue;
	cs.bloodPotency = testBloodPotencyValue;
	cs.hunger = testHungerValue;

	const csLoaded = CharacterSheet.loadFromFile({ filePath: filePathRandom });

	console.log({
		testName,
		log1: csLoaded.getLogData(),
		log2: cs2.getLogData(),
	});

	// properties should be up to date on loaded instance
	expect(csLoaded.health).toEqual(testHealthValue);
	expect(csLoaded.bloodPotency).toEqual(testBloodPotencyValue);
	expect(csLoaded.hunger).toEqual(testHungerValue);

	// separate instance properties should be up to date // ? is this good?
	expect(cs2.health).toEqual(testHealthValue);
	expect(cs2.bloodPotency).toEqual(testBloodPotencyValue);
	expect(cs2.hunger).toEqual(testHungerValue);

	// check changes were logged
	expect(csLoaded.getLogData().length).toBeGreaterThanOrEqual(3);

	// add more log items
	csLoaded.health += 3;
	csLoaded.bloodPotency += 3;
	csLoaded.hunger += 3;

	console.log({
		testName,
		log1: csLoaded.getLogData(),
		log2: cs2.getLogData(),
	});

	// check changes were logged
	expect(csLoaded.getLogData().length).toBeGreaterThanOrEqual(6);
	expect(csLoaded.getLogData()).toEqual(cs2.getLogData());
});

testName = 'test basic trait methods';
test(testName, () => {
	const cs = CharacterSheet.loadFromFile({ filePath: filePathRandom });

	cs.attributes.set('Strength', 5);
	cs.skills.set('Athletics', 3);
	cs.touchstonesAndConvictions.set('a custom one', 'something, something, something');

	expect((cs.attributes.get('Strength') as iAttribute).value).toEqual(5);
	expect((cs.skills.get('Athletics') as iSkill)?.value).toEqual(3);
	expect((cs.touchstonesAndConvictions.get('a custom one') as iTouchStoneOrConviction)?.value).toEqual(
		'something, something, something'
	);
});

// todo test what happens if file doesnt exist

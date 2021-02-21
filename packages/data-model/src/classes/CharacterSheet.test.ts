import fs from 'fs-extra';
import path from 'path';
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

	// console.log({ testName, csLoadedData: csLoaded.toJson(), cs2Data: cs2.toJson() });

	// properties should be up to date on loaded instance
	expect(csLoaded.health).toEqual(testHealthValue);
	expect(csLoaded.bloodPotency).toEqual(testBloodPotencyValue);
	expect(csLoaded.hunger).toEqual(testHungerValue);

	// separate instance properties should be up to date // ? is this good?
	expect(cs2.health).toEqual(testHealthValue);
	expect(cs2.bloodPotency).toEqual(testBloodPotencyValue);
	expect(cs2.hunger).toEqual(testHungerValue);
});

testName = 'test trait methods';
test(testName, () => {
	const cs = CharacterSheet.loadFromFile({ filePath: filePathRandom });

	cs.setAttribute('Strength', 5);
	cs.setSkill('Athletics', 3);

	expect(cs.getAttributeByName('Strength')?.value).toEqual(5);
	expect( cs.getSkillByName( 'Athletics' )?.value ).toEqual( 3 );
	
	
});

// todo test what happens if file doesnt exist

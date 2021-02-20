import fs from 'fs-extra';
import path from 'path';
import CharacterSheet from './CharacterSheet';

const testUserId = Math.floor(Math.random() * 999999);
const filePath = path.resolve(__dirname, `../data/character-sheets/temporary/${testUserId}.json`);

let testName: string;

testName = 'save new blank character sheet and load the character sheet';

test(testName, () => {
	// creates new sheet and does initial save
	const cs = new CharacterSheet(testUserId, filePath);

	const csLoaded = CharacterSheet.loadFromFile({ filePath });

	console.log({ testName, testUserId, filePath, cs, csLoaded });

	// file should exist after save
	expect(fs.pathExistsSync(filePath)).toBe(true);

	// user id should be the same
	expect(csLoaded.discordUserId).toEqual(testUserId);

	// sheets should be the same
	expect(cs).toEqual(csLoaded);
});

testName = 'test autosave';
test(testName, () => {
	const cs = CharacterSheet.loadFromFile({ filePath });

	const cs2 = CharacterSheet.loadFromFile({ filePath });

  const testHealthValue = 3;

	// test change with auto save
	cs.health = testHealthValue;

	const csLoaded = CharacterSheet.loadFromFile({ filePath });

	console.log({ testName, csLoadedHealth: csLoaded.health });

	// health should be as specified
	expect(csLoaded.health).toEqual(testHealthValue);

	// separate instance should update // ? is this good?
	expect(cs2.health).toEqual(testHealthValue);
});

// todo test what happens if file doesnt exist

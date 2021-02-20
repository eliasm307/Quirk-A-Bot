import fs from 'fs-extra';
import path from 'path';
import CharacterSheet from './CharacterSheet';

test('save new blank character sheet and load the character sheet', () => {
	const testUserId = Math.floor(Math.random() * 999999);

	const filePath = path.resolve(__dirname, `../data/character-sheets/temporary/${testUserId}.json`);

  // creates new sheet and does initial save
	const cs = new CharacterSheet(testUserId, filePath);
 

	const csLoaded = CharacterSheet.loadFromFile({ filePath });

	console.log({ testUserId, filePath, cs, csLoaded });

  // file should exist after save
	expect(fs.pathExistsSync(filePath)).toBe(true);

  // user id should be the same
	expect(csLoaded.discordUserId).toEqual(testUserId);

  // sheets should be the same
	expect(cs).toEqual(csLoaded);
});

// todo test what happens if file doesnt exist
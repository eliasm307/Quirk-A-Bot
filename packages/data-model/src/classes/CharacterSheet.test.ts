import fs from 'fs-extra';
import path from 'path';
import CharacterSheet from './CharacterSheet';

test('save new blank character sheet', () => {
	const testUserId = Math.floor(Math.random() * 999999);

	const filePath = path.resolve(__dirname, `../data/character-sheets/test/${testUserId}.json`);

	const cs = new CharacterSheet(testUserId);

	console.log({ testUserId, filePath, cs });

	cs.saveToFile(filePath);

	expect(fs.pathExistsSync(filePath)).toBe(true);
});

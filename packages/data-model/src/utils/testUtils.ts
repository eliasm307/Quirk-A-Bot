import CharacterSheet from '../classes/CharacterSheet';
import path from 'path';

export const testUserId = Math.floor(Math.random() * 999999);
export const filePathRandom = path.resolve(__dirname, `../data/character-sheets/temporary/${testUserId}.json`);

export const filePath = path.resolve(__dirname, '../data/character-sheets/temporary/test.json');

export const testCs: CharacterSheet = CharacterSheet.loadFromFile({ filePath });

export const testCsRandom = new CharacterSheet(testUserId, filePathRandom);

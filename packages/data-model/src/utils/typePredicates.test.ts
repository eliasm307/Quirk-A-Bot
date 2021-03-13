import {
  iCharacterSheetData
} from '../classes/characterSheet/interfaces/character-sheet-interfaces';
import { iGeneralTraitData } from '../classes/traits/interfaces/trait-interfaces';
import { hasCleanUp, isCharacterSheetData, isTraitData } from './typePredicates';

test('Trait data predicate', () => {
	const numberTraitData: iGeneralTraitData = {
		name: 'name',
		value: Number.MAX_SAFE_INTEGER,
	};

	const stringTraitData: iGeneralTraitData = {
		name: 'name',
		value: 'value',
	};

	const notTraitData = {
		name: 'name',
	};

	const notTraitData2 = {
		...stringTraitData,
		groove: 'yes',
	};

	expect(isTraitData(numberTraitData)).toBeTruthy();
	expect(isTraitData(stringTraitData)).toBeTruthy();
	expect(isTraitData(notTraitData)).toBeFalsy();
	expect(isTraitData(notTraitData2)).toBeFalsy();
	expect(isTraitData(1)).toBeFalsy();
});

test('Character sheet data predicate', () => {
	const correctData: iCharacterSheetData = {
		attributes: [],
		disciplines: [],
		skills: [],
		touchstonesAndConvictions: [],
		id: '0',
		bloodPotency: { name: 'Blood Potency', value: 2 },
		clan: { name: 'Clan', value: 'clan' },
		health: { name: 'Health', value: 2 },
		humanity: { name: 'Humanity', value: 2 },
		hunger: { name: 'Hunger', value: 2 },
		name: { name: 'Name', value: 'name' },
		sire: { name: 'Sire', value: 'name' },
		willpower: { name: 'Willpower', value: 2 },
	};

	// todo give data variables friendly names
	// copy and invalidate good data
	const badData1: any = { ...correctData, health: {} };
	const badData2: any = { ...correctData };
	delete badData2.id;
	const badData3 = { ...correctData, health: { name: '' } };

	const badData4 = { ...correctData, skills: { name: '' } };
	const badData5 = { ...correctData, skills: [{ name: '' }, { name: 'Hunger', value: 2 }] };
	const badData6 = { ...correctData, health: { name: 5, value: 5 } };
	const badData7 = { ...correctData, clan: { name: '' } };

	expect(isCharacterSheetData(correctData)).toBeTruthy();
	expect(isCharacterSheetData(1)).toBeFalsy();
	expect(isCharacterSheetData(badData1)).toBeFalsy();
	expect(isCharacterSheetData(badData2)).toBeFalsy();
	expect(isCharacterSheetData(badData3)).toBeFalsy();
	expect(isCharacterSheetData(badData4)).toBeFalsy();
	expect(isCharacterSheetData(badData5)).toBeFalsy();
	expect(isCharacterSheetData(badData6)).toBeFalsy();
	expect(isCharacterSheetData(badData7)).toBeFalsy();
});

test('hasCleanUp predicate', () => {
	expect(hasCleanUp({ cleanUp: () => {} })).toBeTruthy();
	expect(hasCleanUp(5)).toBeFalsy();
});

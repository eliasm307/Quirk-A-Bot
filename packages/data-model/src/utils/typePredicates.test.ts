import { iCharacterSheetData } from './../declarations/interfaces/character-sheet-interfaces';
import { iGeneralTraitData } from './../declarations/interfaces/trait-interfaces';
import { isCharacterSheetData, isTraitData } from './typePredicates';

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

	expect(isTraitData(numberTraitData)).toBeTruthy();
	expect(isTraitData(stringTraitData)).toBeTruthy();
	expect(isTraitData(notTraitData)).toBeFalsy();
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

	// copy and invalidate good data
	const badData1: any = { ...correctData, health: {} };

	expect(isCharacterSheetData(correctData)).toBeTruthy();
	expect(isCharacterSheetData(badData1)).toBeFalsy();
});

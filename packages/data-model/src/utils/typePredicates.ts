import { iGeneralTrait, iGeneralTraitData } from './../declarations/interfaces/trait-interfaces';
import { iGeneralTraitCollection } from './../declarations/interfaces/trait-collection-interfaces';
import { ATTRIBUTE_NAMES, SKILL_NAMES, DISCIPLINE_NAMES } from '../constants';
import { iCharacterSheetData } from '../declarations/interfaces/character-sheet-interfaces';
import { AttributeName, SkillName, DisciplineName } from '../declarations/types';

export function isAttributeName(name: string): name is AttributeName {
	const allowedKeys: string[] = [...ATTRIBUTE_NAMES];
	return allowedKeys.indexOf(name) !== -1;
}
export function isSkillName(name: string): name is SkillName {
	const allowedKeys: string[] = [...SKILL_NAMES];
	return allowedKeys.indexOf(name) !== -1;
}
export function isDisciplineName(name: string): name is DisciplineName {
	const allowedKeys: string[] = [...DISCIPLINE_NAMES];
	return allowedKeys.indexOf(name) !== -1;
}
export function isCharacterSheetData(data: any): data is iCharacterSheetData {
	// todo test
	if (typeof data !== 'object') {
		console.warn(`isCharacterSheetData, data is not an object, it is ${typeof data}`);
		return false;
	}

	const {
		attributes,
		bloodPotency,
		clan,
		disciplines,
		id,
		health,
		humanity,
		hunger,
		name,
		sire,
		skills,
		touchstonesAndConvictions,
		willpower,
	} = data;

	// check primitve values
	if (typeof id !== 'number' && typeof id !== 'string') {
		console.warn(`isCharacterSheetData, id is not a number or string, it is ${typeof id}`, {
			id,
		});
		return false;
	}

	// check core number traits
	const coreNumberTraitData: any[] = [health, humanity, hunger, willpower, bloodPotency];

	for (let traitData of coreNumberTraitData) {
		if (!isTraitData(traitData) || typeof traitData.value !== 'number') {
			console.warn(
				`isCharacterSheetData, core number trait ${traitData} is not a valid trait data or does not have a number value`,
				{ traitData, isTraitData: isTraitData(traitData), typeofValue: typeof traitData.value }
			);
			return false;
		}
	}

	// check core string traits
	const coreStringTraitData: any[] = [clan, name, sire];
	for (let traitData of coreStringTraitData) {
		if (!isTraitData(traitData) || typeof traitData.value !== 'string') {
			console.warn(
				`isCharacterSheetData, core string trait ${traitData} is not a valid trait data or does not have a string value`,
				{ traitData, isTraitData: isTraitData(traitData), typeofValue: typeof traitData.value }
			);
			return false;
		}
	}

	// check trait arrays
	const traitDataArrays: any[] = [attributes, disciplines, skills, touchstonesAndConvictions];
	for (let tc of traitDataArrays) {
		if (!Array.isArray(tc)) {
			console.warn(`isCharacterSheetData, trait collection is not an array, it is "${tc}"`, { tc });
			return false;
		}
		for (let traitData of tc) {
			if (!isTraitData(traitData)) {
				console.warn(`isCharacterSheetData, item in trait collection is not a valid trait data, it is "${traitData}"`, {
					traitData,
					isTraitData: isTraitData(traitData),
					typeofValue: typeof traitData.value,
				});
				return false;
			}
		}
	}

	// if all checks pass then it is what it is
	return true;
	// todo test this
}

export function isTraitData(data: any): data is iGeneralTraitData {
	const nameExists = typeof data.name === 'string';
	const valueExists = typeof data.value === 'string' || typeof data.value === 'number';

	if (typeof data === 'object' && nameExists && valueExists) {
		return true;
	}
	/*
	console.warn(`isTraitData, not trait data`, {
		data,
		typeofData: typeof data,
		nameExists,
		valueExists,
	});
	*/
	return false;
}

export function isTraitCollection(data: any): data is iGeneralTraitCollection {
	// todo test
	return (
		typeof data === 'object' &&
		!!data.delete &&
		!!data.get &&
		!!data.getLogEvents &&
		!!data.getLogReport &&
		!!data.has &&
		typeof data.name === 'string' &&
		!!data.set &&
		typeof data.size === 'number' &&
		!!data.toArray &&
		!!data.toJson
	);
}

export function isBaseTrait(data: any): data is iGeneralTrait {
	// todo test
	if (typeof data !== 'object') return false;
	// todo improve this to account for types
	return !!data.name && !!data.value && !!data.getLogEvents && !!data.getLogReport && !!data.toJson;
}

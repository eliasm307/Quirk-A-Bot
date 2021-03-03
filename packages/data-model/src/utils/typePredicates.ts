import { iGeneralTrait, iGeneralTraitData } from './../declarations/interfaces/trait-interfaces';
import { iTraitCollection, iGeneralTraitCollection } from './../declarations/interfaces/trait-collection-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from './../declarations/types';

import { ATTRIBUTE_NAMES, SKILL_NAMES, DISCIPLINE_NAMES } from '../constants';
import { iCharacterSheetData } from '../declarations/interfaces/character-sheet-interfaces';
import { iBaseTrait, iTraitData } from '../declarations/interfaces/trait-interfaces';
import { AttributeName, SkillName, DisciplineName } from '../declarations/types';
import { type } from 'os';

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
export function isCharacterSheetData(data: iCharacterSheetData): data is iCharacterSheetData {
	const {
		attributes,
		bloodPotency,
		clan,
		disciplines,
		discordUserId,
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
	if (!discordUserId) return false;

	// check single core traits
	const coreTraitData: any[] = [clan, health, humanity, hunger, name, sire, willpower, bloodPotency];
	coreTraitData.forEach(traitData => {
		if (!isTraitData(traitData)) return false;
	});

	// check trait arrays
	const traitDataArrays: any[] = [attributes, disciplines, skills, touchstonesAndConvictions];
	traitDataArrays.forEach(tc => {
		if (!Array.isArray(tc)) return false;
		tc.forEach(traitData => {
			if (!isTraitData(traitData)) return false;
		});
	});

	// if all checks pass then it is what it is
	return true;
	// todo test this
}

export function isTraitData(data: iGeneralTraitData): data is iGeneralTraitData {
	return !!data.name && !!data.value;
}

export function isTraitCollection(data: iGeneralTraitCollection): data is iGeneralTraitCollection {
	return (
		!!data.delete &&
		!!data.get &&
		!!data.getLogEvents &&
		!!data.getLogReport &&
		!!data.has &&
		!!data.name &&
		!!data.set &&
		!!data.size &&
		!!data.toArray &&
		!!data.toJson
	);
}

export function isBaseTrait(data: iGeneralTrait): data is iGeneralTrait {
	// todo improve this to account for types
	return !!data.name && !!data.value && !!data.getLogEvents && !!data.getLogReport && !!data.toJson;
}

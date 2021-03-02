import { TraitNameUnionOrString, TraitValueTypeUnion } from './../declarations/types';

import { ATTRIBUTE_NAMES, SKILL_NAMES, DISCIPLINE_NAMES } from '../constants';
import { iCharacterSheetData } from '../declarations/interfaces/character-sheet-interfaces';
import { iBaseTrait, iTraitData } from '../declarations/interfaces/trait-interfaces';
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
export function isCharacterSheetData(data: iCharacterSheetData): data is iCharacterSheetData {
	// todo improve this
	return !!data.discordUserId;
}

export function isBaseTrait<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iTraitData<N, V>
>(data: any): data is iBaseTrait<N, V, D> {
	// todo improve this to account for types
	return !!data.name && !!data.value;
}

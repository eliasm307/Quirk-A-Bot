import { ATTRIBUTE_CATEGORIES, TRAIT_TYPES } from './../constants';
import { ATTRIBUTE_NAMES, SKILL_NAMES, DISCIPLINE_NAMES } from '../constants';
import { iAttribute, iDiscipline, iSkill, iTrait, iTouchStoneOrConviction } from './interfaces';

export type ClanName = 'Caitiff' | string; // todo explicitly specify names
export type AttributeCategory = typeof ATTRIBUTE_CATEGORIES[number];
export type AttributeName = typeof ATTRIBUTE_NAMES[number];
export type SkillName = typeof SKILL_NAMES[number];
export type DisciplineName = typeof DISCIPLINE_NAMES[number];
export type TraitName<T> = T extends iSkill
	? SkillName
	: T extends iAttribute
	? AttributeName
	: T extends iDiscipline
	? DisciplineName
	: string; // NOTE make sure this covers all options

export type TraitValue<T> = T extends iTouchStoneOrConviction ? string : number;
export type TraitMap<T extends iTrait> = Map<TraitName<T>, T>;
export type TraitType = typeof TRAIT_TYPES[number];

export type LogOperation = 'ADD' | 'UPDATE' | 'DELETE';

export type LogInitialValue<T, O extends LogOperation> = O extends 'ADD' ? void : T;

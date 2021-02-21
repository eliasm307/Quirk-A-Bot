import Attribute from '../classes/Attribute';
import Skill from '../classes/Skill';
import { iAttribute, iDiscipline, iSkill, iTrait } from './interfaces';
// todo explicitly specify names
export type ClanName = string;

export type AttributeCategory = 'Physical' | 'Social' | 'Mental';

// ? put this in a different file?
export const attributeNames = [
	'Strength',
	'Dexterity',
	'Stamina',
	'Charisma',
	'Manipulation',
	'Composure',
	'Intelligence',
	'Wits',
	'Resolve',
] as const;

// ? put this in a different file?
export function isAttributeName(value: string | AttributeName): value is AttributeName {
	const allowedKeys: string[] = [...attributeNames];
	return allowedKeys.indexOf(value) !== -1;
}
export type AttributeName = typeof attributeNames[number];
/*
	| 'Strength'
	| 'Dexterity'
	| 'Stamina'
	| 'Charisma'
	| 'Manipulation'
	| 'Composure'
	| 'Intelligence'
	| 'Wits'
	| 'Resolve';*/

export type SkillName = 'Athletics' | 'Brawl' | 'Craft'; // todo explicitly specify names
export type DisciplineName = string; // todo explicitly specify names
export type AttributeMap = Map<AttributeName, iAttribute>;
export type DisciplineMap = Map<DisciplineName, iDiscipline>;
export type SkillMap = Map<SkillName, iSkill>;

export type TraitName<T extends iTrait> = T extends Skill ? SkillName : T extends Attribute ? AttributeName : string;

export type TraitMapImplicit = SkillMap | AttributeMap | DisciplineMap;

export type TraitMap<T extends iTrait> = T extends Skill
	? SkillMap
	: T extends Attribute
	? AttributeMap
	: Map<string, iTrait>;

/*
// ? is this level of generalisation worth it?



*/

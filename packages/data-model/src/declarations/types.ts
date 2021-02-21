import { ATTRIBUTE_CATEGORIES } from './../constants';
import Attribute from '../classes/Attribute';
import Skill from '../classes/Skill';
import { ATTRIBUTE_NAMES, SKILL_NAMES, DISCIPLINE_NAMES } from '../constants';
import { iAttribute, iDiscipline, iSkill, iTrait } from './interfaces';

export type ClanName = string; // todo explicitly specify names
export type AttributeCategory = typeof ATTRIBUTE_CATEGORIES[number];
export type AttributeName = typeof ATTRIBUTE_NAMES[number];
export type SkillName = typeof SKILL_NAMES[number];
export type DisciplineName = typeof DISCIPLINE_NAMES[number];
export type AttributeMap = Map<AttributeName, iAttribute>;
export type DisciplineMap = Map<DisciplineName, iDiscipline>;
export type SkillMap = Map<SkillName, iSkill>;
export type TraitName<T extends iTrait> = T extends Skill ? SkillName : T extends Attribute ? AttributeName : ''; // todo make sure this covers all options
export type TraitMap<T extends iTrait> = T extends Skill
	? SkillMap
	: T extends Attribute
	? AttributeMap
	: Map<string, iTrait>; // todo make sure this covers all options

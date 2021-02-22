import { ATTRIBUTE_CATEGORIES } from './../constants';
import Attribute from '../classes/Attribute';
import Skill from '../classes/Skill';
import { ATTRIBUTE_NAMES, SKILL_NAMES, DISCIPLINE_NAMES } from '../constants';
import { iAttribute, iDiscipline, iSkill, iTrait, iTouchStoneOrConviction } from './interfaces';
import Discipline from '../classes/Discipline';

export type ClanName = string; // todo explicitly specify names
export type AttributeCategory = typeof ATTRIBUTE_CATEGORIES[number];
export type AttributeName = typeof ATTRIBUTE_NAMES[number];
export type SkillName = typeof SKILL_NAMES[number];
export type DisciplineName = typeof DISCIPLINE_NAMES[number];
  type AttributeMap = Map<AttributeName, iAttribute>;
export type DisciplineMap = Map<DisciplineName, iDiscipline>;
export type SkillMap = Map<SkillName, iSkill>;
export type TraitName<T> = T extends iSkill
	? SkillName
	: T extends iAttribute
	? AttributeName
	: T extends iDiscipline
	? DisciplineName
	: string; // todo make sure this covers all options

export type TraitValue<T> = T extends iTouchStoneOrConviction ? string : number;
export type TraitMap<T extends iTrait> = Map<TraitName<T>, T>;

/*T extends Skill
	? SkillMap
	: T extends Attribute
	? AttributeMap
	: Map<TraitName<T>, iTrait>; // todo make sure this covers all options
	*/

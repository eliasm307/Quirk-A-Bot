import { ATTRIBUTE_CATEGORIES, TRAIT_TYPES } from './../constants';
import { ATTRIBUTE_NAMES, SKILL_NAMES, DISCIPLINE_NAMES } from '../constants';
import {
	iAttributeData,
	iDisciplineData,
	iSkillData,
	iTraitData,
	iTouchStoneOrConvictionData,
	iBaseTrait,
} from './interfaces/trait-interfaces';
import BaseTrait from '../classes/traits/BaseTrait';
import Attribute from '../classes/traits/Attribute';
import TouchStoneOrConviction from '../classes/traits/TouchStoneOrConviction';
import Skill from '../classes/traits/Skill';
import Discipline from '../classes/traits/Discipline';

export type ClanName = 'Caitiff' | string; // todo explicitly specify names
export type AttributeCategory = typeof ATTRIBUTE_CATEGORIES[number];
export type AttributeName = typeof ATTRIBUTE_NAMES[number];
export type SkillName = typeof SKILL_NAMES[number];
export type DisciplineName = typeof DISCIPLINE_NAMES[number];

// todo is this required?
/** Dynamic type for trait name union types */
export type TraitName<T extends iTraitData> = T extends iSkillData
	? SkillName
	: T extends iAttributeData
	? AttributeName
	: T extends iDisciplineData
	? DisciplineName
	: string; // NOTE make sure this covers all options

/** Dynamic type for trait value type */
export type TraitValue<T> = T extends iTouchStoneOrConvictionData ? string : number;

// todo add boolen for the future?
export type TraitTypeUnion = number | string;

export type TraitNameUnion = AttributeName | SkillName | DisciplineName;

// todo is this required
/** Dynamic type for trait data only interfaces */
export type TraitData<T extends iTraitData> = T extends Skill
	? iSkillData
	: T extends Attribute
	? iAttributeData
	: T extends TouchStoneOrConviction
	? iTouchStoneOrConvictionData
	: T extends Discipline
	? iDisciplineData
	: iTraitData;
export type TraitMap<T extends iBaseTrait> = Map<TraitName<T>, T>;
export type TraitType = typeof TRAIT_TYPES[number];

export type LogOperation = 'ADD' | 'UPDATE' | 'DELETE';

export type LogInitialValue<T, O extends LogOperation> = O extends 'ADD' ? undefined : T;
export type LogNewValue<T, O extends LogOperation> = O extends 'DELETE' ? undefined : T;

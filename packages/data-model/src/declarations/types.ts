import { ATTRIBUTE_CATEGORIES, TRAIT_TYPES } from './../constants';
import { ATTRIBUTE_NAMES, SKILL_NAMES, DISCIPLINE_NAMES } from '../constants';
import {
	iAttributeData,
	iDisciplineData,
	iSkillData,
	iTraitData,
	iTouchStoneOrConvictionData,
	iBaseTrait,
	iAttribute,
	iDiscipline,
	iTouchStoneOrConviction,
	iSkill,
	iHasNumberValue,
	iHasStringValue,
} from './interfaces/trait-interfaces';

export type ClanName = 'Caitiff' | string; // todo explicitly specify names
export type AttributeCategory = typeof ATTRIBUTE_CATEGORIES[number];
export type AttributeName = typeof ATTRIBUTE_NAMES[number];
export type SkillName = typeof SKILL_NAMES[number];
export type DisciplineName = typeof DISCIPLINE_NAMES[number];

// todo is this required?
/** Dynamic type for trait name union types */
export type TraitNameDynamic<T extends iTraitData<TraitNameUnionOrString, TraitValueTypeUnion>> = T extends iSkillData
	? SkillName
	: T extends iAttributeData
	? AttributeName
	: T extends iDisciplineData
	? DisciplineName
	: string; // NOTE make sure this covers all options

/** Dynamic type for trait value type */
export type TraitValueDynamic<T> = T extends iHasStringValue
	? string
	: T extends iHasNumberValue
	? number
	: TraitValueTypeUnion;

// todo add boolen for the future?
export type TraitValueTypeUnion = number | string;

export type TraitNameUnion = AttributeName | SkillName | DisciplineName;
export type TraitNameUnionOrString = TraitNameUnion | string;

// todo should fallback be any?
// todo is this required
/** Dynamic type for trait data only interfaces */
export type TraitDataDynamic<T extends iTraitData<TraitNameUnionOrString, TraitValueTypeUnion>> = T extends iSkill
	? iSkillData
	: T extends iAttribute
	? iAttributeData
	: T extends iTouchStoneOrConviction
	? iTouchStoneOrConvictionData
	: T extends iDiscipline
	? iDisciplineData
	: any;
export type TraitMap<T extends iBaseTrait<TraitNameUnionOrString, TraitValueTypeUnion>> = Map<TraitNameDynamic<T>, T>;
export type TraitTypeNameUnion = typeof TRAIT_TYPES[number];

export type LogOperationUnion = 'ADD' | 'UPDATE' | 'DELETE';

export type LogInitialValueDynamic<T, O extends LogOperationUnion> = O extends 'ADD' ? undefined : T;
export type LogNewValueDynamic<T, O extends LogOperationUnion> = O extends 'DELETE' ? undefined : T;

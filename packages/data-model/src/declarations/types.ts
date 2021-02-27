import { ATTRIBUTE_CATEGORIES, TRAIT_TYPES, CORE_NUMBER_TRAITS, CORE_STRING_TRAITS } from './../constants';
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
	iStringTrait,
	iStringTraitData,
	iNumberTrait,
	iNumberTraitData,
} from './interfaces/trait-interfaces';

export type ClanName = 'Caitiff' | string; // todo explicitly specify names
export type AttributeCategory = typeof ATTRIBUTE_CATEGORIES[number];
export type AttributeName = typeof ATTRIBUTE_NAMES[number];
export type SkillName = typeof SKILL_NAMES[number];
export type DisciplineName = typeof DISCIPLINE_NAMES[number];
export type CoreNumberTraitName = typeof CORE_NUMBER_TRAITS[number];
export type CoreStringTraitName = typeof CORE_STRING_TRAITS[number];

// todo is this required?
/** Dynamic type for trait name union types */
export type TraitNameDynamic<T extends iTraitData<TraitNameUnionOrString, TraitValueTypeUnion>> = T extends iSkillData
	? SkillName
	: T extends iAttributeData
	? AttributeName
	: T extends iDisciplineData
	? DisciplineName
	: T extends iStringTraitData<CoreStringTraitName>
	? CoreStringTraitName
	: T extends iNumberTraitData<CoreNumberTraitName>
	? CoreNumberTraitName
	: string; // NOTE make sure this covers all options

/** Dynamic type for trait value type */
export type TraitValueDynamic<T> = T extends iHasStringValue
	? string
	: T extends iHasNumberValue
	? number
	: TraitValueTypeUnion;

// todo add boolen for the future?
export type TraitValueTypeUnion = number | string;

export type TraitNameUnion = AttributeName | SkillName | DisciplineName | CoreStringTraitName | CoreNumberTraitName;
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
	: /*: T extends iStringTrait<CoreTraitName>
	? iStringTraitData<CoreTraitName>
	: T extends iNumberTrait<CoreTraitName>
	? iNumberTrait<CoreTraitName>*/
	  any;
export type TraitMap<T extends iBaseTrait<TraitNameUnionOrString, TraitValueTypeUnion>> = Map<TraitNameDynamic<T>, T>;
export type TraitTypeNameUnion = typeof TRAIT_TYPES[number];

export type LogOperationUnion = 'ADD' | 'UPDATE' | 'DELETE';

export type LogInitialValueDynamic<T, O extends LogOperationUnion> = O extends 'ADD' ? undefined : T;
export type LogNewValueDynamic<T, O extends LogOperationUnion> = O extends 'DELETE' ? undefined : T;

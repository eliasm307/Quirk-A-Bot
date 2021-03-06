import { ATTRIBUTE_CATEGORIES, TRAIT_TYPES, CORE_NUMBER_TRAITS, CORE_STRING_TRAITS } from './../constants';
import { ATTRIBUTE_NAMES, SKILL_NAMES, DISCIPLINE_NAMES } from '../constants';

export type ClanName = 'Caitiff' | string; // todo explicitly specify names
export type AttributeCategory = typeof ATTRIBUTE_CATEGORIES[number];
export type AttributeName = typeof ATTRIBUTE_NAMES[number];
export type SkillName = typeof SKILL_NAMES[number];
export type DisciplineName = typeof DISCIPLINE_NAMES[number];
export type CoreNumberTraitName = typeof CORE_NUMBER_TRAITS[number];
export type CoreStringTraitName = typeof CORE_STRING_TRAITS[number];
export type TraitValueTypeUnion = number | string;
export type TraitNameUnion = AttributeName | SkillName | DisciplineName | CoreStringTraitName | CoreNumberTraitName;
export type TraitNameUnionOrString = TraitNameUnion | string;
export type TraitTypeNameUnion = typeof TRAIT_TYPES[number];
export type LogOperationUnion = 'ADD' | 'UPDATE' | 'DELETE';
export type LogSourceType = 'Trait' | 'Trait Collection';

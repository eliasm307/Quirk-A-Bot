import {
  ATTRIBUTE_CATEGORIES, ATTRIBUTE_NAMES, CORE_NUMBER_TRAIT_NAMES, CORE_STRING_TRAIT_NAMES,
  DISCIPLINE_NAMES, SKILL_NAMES, TRAIT_COLLECTION_NAMES, TRAIT_TYPES,
} from '../constants';

export type ChangeHandler<D> = (newData?: D) => void;

export type SchemaPredicateMap<S extends Record<string, any>> = {
  [K in keyof S]: (value: unknown) => value is S[K];
};

export type ClanName = "Caitiff" | string; // todo explicitly specify names

export type AttributeCategory = typeof ATTRIBUTE_CATEGORIES[number];

export type AttributeName = typeof ATTRIBUTE_NAMES[number];

export type SkillName = typeof SKILL_NAMES[number];

export type DisciplineName = typeof DISCIPLINE_NAMES[number];

export type CoreNumberTraitName = typeof CORE_NUMBER_TRAIT_NAMES[number];

export type CoreStringTraitName = typeof CORE_STRING_TRAIT_NAMES[number];

export type CoreTraitName = CoreNumberTraitName | CoreStringTraitName;

export type TraitValueTypeUnion = number | string;

export type TraitNameUnion =
  | AttributeName
  | SkillName
  | DisciplineName
  | CoreStringTraitName
  | CoreNumberTraitName;

export type TraitNameUnionOrString = TraitNameUnion | string;

export type TraitTypeNameUnion = typeof TRAIT_TYPES[number];

export type TraitCollectionNameUnion = typeof TRAIT_COLLECTION_NAMES[number];

export type LogOperationUnion = "ADD" | "UPDATE" | "DELETE";

export type LogSourceTypeNameUnion =
  | "Trait"
  | "Trait Collection"
  | "Character Sheet";

/** A user id */
export type UID = string;

export type GameId = string;

/** URL to an online resource */
export type WebURL = string;

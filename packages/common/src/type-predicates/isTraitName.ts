import {
  ATTRIBUTE_NAMES, CORE_NUMBER_TRAIT_NAMES, CORE_STRING_TRAIT_NAMES, DISCIPLINE_NAMES, SKILL_NAMES,
} from '../constants';
import {
  AttributeName, CoreNumberTraitName, CoreStringTraitName, DisciplineName, SkillName,
} from '../declarations/typePredicates';

export function isAttributeName(name: unknown): name is AttributeName {
  if (typeof name !== "string") return false;

  const allowedKeys: string[] = [...ATTRIBUTE_NAMES];
  return allowedKeys.indexOf(name) !== -1;
}

export function isSkillName(name: unknown): name is SkillName {
  if (typeof name !== "string") return false;

  const allowedKeys: string[] = [...SKILL_NAMES];
  return allowedKeys.indexOf(name) !== -1;
}

export function isDisciplineName(name: unknown): name is DisciplineName {
  if (typeof name !== "string") return false;

  const allowedKeys: string[] = [...DISCIPLINE_NAMES];
  return allowedKeys.indexOf(name) !== -1;
}

export function isCoreNumberTraitName(
  name: unknown
): name is CoreNumberTraitName {
  if (typeof name !== "string") return false;

  const allowedKeys: string[] = [...CORE_NUMBER_TRAIT_NAMES];
  return allowedKeys.indexOf(name) !== -1;
}

export function isCoreStringTraitName(
  name: unknown
): name is CoreStringTraitName {
  if (typeof name !== "string") return false;

  const allowedKeys: string[] = [...CORE_STRING_TRAIT_NAMES];
  return allowedKeys.indexOf(name) !== -1;
}

import {
  ATTRIBUTE_NAMES, CORE_NUMBER_TRAIT_NAMES, CORE_STRING_TRAIT_NAMES, DISCIPLINE_NAMES, SKILL_NAMES,
} from '../constants';
import {
  AttributeName, CoreNumberTraitName, CoreStringTraitName, DisciplineName, SkillName,
} from '../declarations/types';

export function isAttributeName(name: string): name is AttributeName {
  const allowedKeys: string[] = [...ATTRIBUTE_NAMES];
  return allowedKeys.indexOf(name) !== -1;
}

export function isSkillName(name: string): name is SkillName {
  const allowedKeys: string[] = [...SKILL_NAMES];
  return allowedKeys.indexOf(name) !== -1;
}

export function isDisciplineName(name: string): name is DisciplineName {
  const allowedKeys: string[] = [...DISCIPLINE_NAMES];
  return allowedKeys.indexOf(name) !== -1;
}

export function isCoreNumberTraitName(
  name: string
): name is CoreNumberTraitName {
  const allowedKeys: string[] = [...CORE_NUMBER_TRAIT_NAMES];
  return allowedKeys.indexOf(name) !== -1;
}

export function isCoreStringTraitName(
  name: string
): name is CoreStringTraitName {
  const allowedKeys: string[] = [...CORE_STRING_TRAIT_NAMES];
  return allowedKeys.indexOf(name) !== -1;
}

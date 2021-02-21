import { ATTRIBUTE_NAMES, SKILL_NAMES, DISCIPLINE_NAMES } from "../constants";
import { AttributeName, SkillName, DisciplineName } from "../declarations/types";

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
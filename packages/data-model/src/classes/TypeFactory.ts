import { iAttribute, iSkill } from './../declarations/interfaces';
import { iDiscipline } from '../declarations/interfaces';
import {
	DisciplineMap,
	DisciplineName,
	AttributeMap,
	AttributeName,
	SkillMap,
	SkillName,
} from './../declarations/types';
export default abstract class TypeFactory {
	static newDisciplineMap(): DisciplineMap {
		return new Map<DisciplineName, iDiscipline>();
	}
	static newAttributeMap(): AttributeMap {
		return new Map<AttributeName, iAttribute>();
	}
	static newSkillMap(): SkillMap {
		return new Map<SkillName, iSkill>();
	}
}

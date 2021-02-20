import { iAttribute, iDiscipline, iSkill } from './interfaces';
// todo explicitly specify names
export type ClanName = string;
export type AttributeCategory = 'Physical' | 'Social' | 'Mental';
export type AttributeName =
	| 'Strength'
	| 'Dexterity'
	| 'Stamina'
	| 'Charisma'
	| 'Manipulation'
	| 'Composure'
	| 'Intelligence'
	| 'Wits'
	| 'Resolve'; 
export type SkillName = string; // todo explicitly specify names
export type DisciplineName = string; // todo explicitly specify names
export type AttributeMap = Map<AttributeName, iAttribute>;
export type DisciplineMap = Map<DisciplineName, iDiscipline>;
export type SkillMap = Map<SkillName, iSkill>;

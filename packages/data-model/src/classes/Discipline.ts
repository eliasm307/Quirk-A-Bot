import { DisciplineName, SkillName } from './../declarations/types';
import { iCharacterSheet, iDiscipline, iTrait } from './../declarations/interfaces';
export default class Discipline implements iDiscipline {
	name: DisciplineName;
	value: number;

	constructor(characterSheet: iCharacterSheet, name: DisciplineName, value: number = 0) {
		this.name = name;
		this.value = value;
	}
}

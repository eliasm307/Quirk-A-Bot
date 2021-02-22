import { DisciplineName, SkillName } from './../declarations/types';
import { iCharacterSheet, iDiscipline, iTrait } from './../declarations/interfaces';
import BaseTrait from './BaseTrait';
export default class Discipline extends BaseTrait<iDiscipline> implements iDiscipline {}

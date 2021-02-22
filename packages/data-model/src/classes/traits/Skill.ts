import { SkillName } from '../../declarations/types';
import { iCharacterSheet, iSkill } from '../../declarations/interfaces';
import BaseTrait from './BaseTrait';

export default class Skill extends BaseTrait<iSkill> implements iSkill {}

import { SkillName } from '../declarations/types';
import { iCharacterSheet, iSkill } from '../declarations/interfaces';
import CharacterSheet from './CharacterSheet';
import BaseTrait from './BaseTrait';

export default class Skill extends BaseTrait<iSkill> implements iSkill { 
	constructor(characterSheet: iCharacterSheet, name: SkillName, value: number = 0) {
		super(characterSheet, name, value);
	}
}

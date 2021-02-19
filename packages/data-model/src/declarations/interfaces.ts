import { iCharacterSheetModel } from './interfaces';
import { AttributeCategory, AttributeName, ClanName, DisciplineName, SkillName, AttributeMap, SkillMap, DisciplineMap } from './types';

export interface iAttribute {
	category: AttributeCategory;
	name: AttributeName; // todo add options explicitly
	rating: number; // todo limit to 0-5
}

export interface iSkill {
	name: SkillName;
	rating: number; // todo limit to 0-5
}

export interface iDiscipline {
	name: DisciplineName;
	level: number; // todo limit to 0-5
	// todo add "specialisation" / sub types?
}

export interface iCharacterSheet {
	id: string;
	name: string;
	clan: ClanName;
	sire: string;
	attributes: AttributeMap;
	health: number; // todo limit 0 to 10
	willpower: number; // todo limit 0 to 10
	skills: SkillMap;
	disciplines: DisciplineMap;
	hunger: number; // todo limit 0 to 5
	humanity: number; // todo limit 0 to 10
	bloodPotency: number; // todo limit 0 to 10
  touchstonesAndConvictions: string[];
  

}

export interface iCharacterSheetModel {
	characterSheet: iCharacterSheet;
}

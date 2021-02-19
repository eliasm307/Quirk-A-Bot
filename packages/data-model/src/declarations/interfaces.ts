import {
	AttributeCategory,
	AttributeName,
	ClanName,
	DisciplineName,
	SkillName, 
} from './types';

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
	discordUserId: number;
	name: string;
	clan: ClanName;
	sire: string;
	health: number; // todo limit 0 to 10
	willpower: number; // todo limit 0 to 10
	hunger: number; // todo limit 0 to 5
	humanity: number; // todo limit 0 to 10
	bloodPotency: number; // todo limit 0 to 10
	touchstonesAndConvictions: string[];
	attributes: iAttribute[];
	skills: iSkill[];
	disciplines: iDiscipline[];
}

export interface iCharacterSheetModel {
	characterSheet: iCharacterSheet;
}

import {
	AttributeCategory,
	AttributeName,
	ClanName,
	DisciplineName,
	SkillName, 
} from './types';

export interface iDetail { 
	name: string;
	value: number;
}

export interface iAttribute extends iDetail {
	category: AttributeCategory;
	name: AttributeName; // todo add options explicitly
	value: number; // todo limit to 0-5
}

export interface iSkill extends iDetail {
	name: SkillName;
	value: number; // todo limit to 0-5
}

export interface iDiscipline extends iDetail {
	name: DisciplineName;
	value: number; // todo limit to 0-5
	// todo add "specialisation" / sub types?
}

export interface iCharacterSheet {
  discordUserId: number;
  // todo add user aliases (ie known discord names to be added by bot)
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

// todo is this required?
export interface iCharacterSheetModel {
	characterSheet: iCharacterSheet;
}

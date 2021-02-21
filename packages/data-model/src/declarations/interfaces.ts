import Attribute from '../classes/Attribute';
import Skill from '../classes/Skill';
import { AttributeCategory, AttributeName, ClanName, DisciplineName, SkillName, TraitName } from './types';

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

export interface iCharacterSheetData {
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
export interface iCharacterSheet extends iCharacterSheetData {
	saveToFile(): boolean; // ? should this be handled by another class?

	// this is difficult to implement because at some point you need to choose a 
	setTrait<T>(name: TraitName<T>, value: number): void;

	/*
	// ? make traitCollection class to do these operations?
	setSkill( name: SkillName, value: number ): void;
	removeSkill(name: SkillName): void
	getSkillByName(name: SkillName): iSkill | null;

	// ? make traitCollection class to do these operations?
	setAttribute( name: AttributeName, value: number ): void;
	removeAttribut
	getAttributeByName(name: AttributeName): iAttribute | null; 
	*/
}

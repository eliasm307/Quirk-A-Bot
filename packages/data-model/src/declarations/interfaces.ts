import Attribute from '../classes/Attribute';
import Discipline from '../classes/Discipline';
import Skill from '../classes/Skill';
import TraitCollection from '../classes/TraitCollection';
import { AttributeCategory, AttributeName, ClanName, DisciplineName, SkillName, TraitName } from './types';

export interface iTrait  {
	// name: TraitName<T>;
	name: string;
	value: number; // todo limit to 0-5
}

export interface iAttribute extends iTrait  {
	name: AttributeName
}

export interface iAttribute2 extends iTrait  {
	category: AttributeCategory; // todo handle category as separate interface implemented by class
	name: AttributeName; // todo add options explicitly 
}

export interface iSkill extends iTrait  {
	 name: SkillName; 
}

export interface iDiscipline extends iTrait  {
 name: DisciplineName; 
	// todo add "specialisation" / sub types?
}

interface iCharacterSheetPrimitiveData {
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
}

interface iCharacterSheetNonPrimitiveData {
	touchstonesAndConvictions: string[];
	attributes: iAttribute[];
	skills: iSkill[];
	disciplines: iDiscipline[];
}

export interface iCharacterSheetData extends iCharacterSheetPrimitiveData, iCharacterSheetNonPrimitiveData {}

export interface iCharacterSheet extends iCharacterSheetPrimitiveData {
	saveToFile(): boolean; // ? should this be handled by another class?

	// this is difficult to implement because at some point you need to choose a
	// setTrait<T extends iTrait>(name: TraitName<T>, value: number): void;

	skills: TraitCollection<iSkill>;
	attributes: TraitCollection<iAttribute>;

	disciplines: TraitCollection<iDiscipline>;

	// ? make traitCollection class to do these operations?

	setSkill(name: SkillName, value: number): void;
	getSkillByName(name: SkillName): iSkill | null;
	// todo removeSkill(name: SkillName): void;

	// ? make traitCollection class to do these operations?
	setAttribute(name: AttributeName, value: number): void;
	getAttributeByName(name: AttributeName): iAttribute | null;
	// todo removeAttribute(name: AttributeName): void;

	/*	*/
}

export interface iTraitCollection<T extends iTrait > {
	get(name: TraitName<T>): T | void;
	set(name: TraitName<T>, value: number): void;

	delete(name: TraitName<T>): void;

	has(name: TraitName<T>): boolean;

	toJson(): iTrait [];
	readonly size: number;
}

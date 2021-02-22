import Attribute from '../classes/Attribute';
import Discipline from '../classes/Discipline';
import Skill from '../classes/Skill';
import TraitCollection from '../classes/TraitCollection';
import { AttributeCategory, AttributeName, ClanName, DisciplineName, SkillName, TraitName } from './types';

export interface iTrait {
	// name: TraitName<T>;
	name: string;
	value: number | string; // todo limit to 0-5
}

export interface iAttribute extends iTrait {
	name: AttributeName;
	value: number;
}

export interface iTouchStoneOrConviction extends iTrait {
	name: string;
	value: string;
}

export interface iAttribute2xxxxxxxxxxxxxxxxx extends iTrait {
	category: AttributeCategory; // todo handle category as separate interface implemented by class
	name: AttributeName; // todo add options explicitly
}

export interface iSkill extends iTrait {
	name: SkillName;
	value: number;
}

export interface iDiscipline extends iTrait {
	name: DisciplineName;
	value: number;
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
	touchstonesAndConvictions: iTouchStoneOrConviction[];
	attributes: iAttribute[];
	skills: iSkill[];
	disciplines: iDiscipline[];
}

export interface iCharacterSheetData extends iCharacterSheetPrimitiveData, iCharacterSheetNonPrimitiveData {}

export interface iCharacterSheet extends iCharacterSheetPrimitiveData {
	saveToFile(): boolean; // ? should this be handled by another class?
	toJson(): iCharacterSheetData;

	// this is too general and causes intellisense to stop working, prefer using custom collections
	// setTrait<T extends iTrait>(name: TraitName<T>, value: number): void;

	skills: TraitCollection<iSkill>;
	attributes: TraitCollection<iAttribute>;
	disciplines: TraitCollection<iDiscipline>;
	touchstonesAndConvictions: TraitCollection<iTouchStoneOrConviction>;
}

export interface iTraitCollection<T extends iTrait> {
	get(name: TraitName<T>): T | void;
	set(name: TraitName<T>, value: number): void;

	delete(name: TraitName<T>): void;

	has(name: TraitName<T>): boolean;

	toJson(): iTrait[];
	readonly size: number;
}

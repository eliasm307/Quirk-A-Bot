import Attribute from '../classes/traits/Attribute';
import Discipline from '../classes/traits/Discipline';
import Skill from '../classes/traits/Skill';
import TouchStoneOrConviction from '../classes/traits/TouchStoneOrConviction';
import TraitCollection from '../classes/traits/TraitCollection';
import {
	AttributeCategory,
	AttributeName,
	ClanName,
	DisciplineName,
	SkillName,
	TraitName,
	LogOperation,
	LogInitialValue,
	TraitValue,
	TraitData,
} from './types';

export interface iToJson<T> {
	toJson: () => T;
}

/** Describes the shape of the most basic trait */
export interface iTraitData {
	name: string;
	value: number | string; // todo limit to 0-5
}
 
export interface iBaseTrait extends iTraitData, iToJson<iTraitData>, iLogger {
	// todo add explain method to give a summary what this trait is for
	// todo add explainValue method to describe the current value of the attribute, ie add description getter to describe the meaning of a value
}

export interface iBaseTraitProps<T extends iTraitData> {
	saveAction: () => boolean;
	name: TraitName<T>;
	value: TraitValue<T>;
}

export interface iAttributeData extends iTraitData {
	name: AttributeName;
	value: number;
	category: AttributeCategory;
}

export interface iTouchStoneOrConvictionData extends iTraitData {
	name: string;
	value: string;
}

export interface iSkillData extends iTraitData {
	name: SkillName;
	value: number;
}

export interface iDisciplineData extends iTraitData {
	name: DisciplineName;
	value: number;
	// todo add "specialisation" / sub types?
}

export interface iSaveAction {
	saveAction: () => boolean;
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
	touchstonesAndConvictions: iTouchStoneOrConvictionData[];
	attributes: iAttributeData[];
	skills: iSkillData[];
	disciplines: iDisciplineData[];
}

export interface iCharacterSheetData extends iCharacterSheetPrimitiveData, iCharacterSheetNonPrimitiveData {}

export interface iCharacterSheet extends iCharacterSheetPrimitiveData, iToJson<iCharacterSheetData> {
	// saveToFile(): boolean; // ? should this be handled by another class?
	// toJson(): iCharacterSheetData;

	skills: TraitCollection<Skill>;
	attributes: TraitCollection<Attribute>;
	disciplines: TraitCollection<Discipline>;
	touchstonesAndConvictions: TraitCollection<TouchStoneOrConviction>;
}

export interface iTraitCollection<T extends iBaseTrait> extends iToJson<iTraitData[]> {
	get(name: TraitName<T>): T | void;
	set(name: TraitName<T>, value: number): void;
	delete(name: TraitName<T>): void;
	has(name: TraitName<T>): boolean;
	readonly size: number;
}

export interface iOldValue<T> {
	oldValue: T;
}

export interface iNewValue<T> {
	newValue: T; // delete doesnt require this
}

export interface iBaseLogEventProps {
	note?: string;
	property: string;
}

// todo this violates interface segregation, intial and new value arent universal
export interface iLogEvent extends iBaseLogEventProps {
	operation: LogOperation;
	describe(): string;
	time: Date;
}

export interface iAddLogEvent<T> extends iLogEvent, iNewValue<T> {}

/** For objects that require internal logging */
export interface iLogger {
	getLogData(): iLogEvent[];
}

export interface iLogReporter {
	generateLogReport(logger: iLogger): string;
}

export interface iLogCollection {
	log(event: iLogEvent): void;

	toJson(): iLogEvent[];
}

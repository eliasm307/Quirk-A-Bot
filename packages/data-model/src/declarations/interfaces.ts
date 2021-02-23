import TraitCollection from '../classes/TraitCollection';
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
} from './types';

export interface iTrait {
	// name: TraitName<T>;
	name: string;
	value: number | string; // todo limit to 0-5
	// todo add description getter to describe the meaning of a value
}

export interface iBaseTraitProps<T extends iTrait> {
	saveAction: () => boolean;
	name: TraitName<T>;
	value: TraitValue<T>;
}

export interface iAttribute extends iTrait {
	name: AttributeName;
	value: number;
	category: AttributeCategory; // todo handle category as separate interface implemented by class?
}

export interface iTouchStoneOrConviction extends iTrait {
	name: string;
	value: string;
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
	touchstonesAndConvictions: iTouchStoneOrConviction[];
	attributes: iAttribute[];
	skills: iSkill[];
	disciplines: iDiscipline[];
}

export interface iCharacterSheetData extends iCharacterSheetPrimitiveData, iCharacterSheetNonPrimitiveData {}

export interface iCharacterSheet extends iCharacterSheetPrimitiveData {
	// saveToFile(): boolean; // ? should this be handled by another class?
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

export interface iOldValue<T> {
	oldValue: T; // initial value not required if its an addition // todo enforce this in implementation
}

export interface iNewValue<T> {
	newValue : T; // delete doesnt require this
}

export interface iBaseLogEventProps {
	note?: string;
	property: string;
}

// todo this violates interface segregation, intial and new value arent universal
export interface iLogEvent<T> extends iBaseLogEventProps {
	operation: LogOperation;
	describe(): string;
	time: Date;
}

export interface iAddLogEvent<T> extends iLogEvent<T>, iNewValue<T> {}

/** For objects that require internal logging */
export interface iLogger<T> {
	getLogData(): iLogEvent<T>[];
}

export interface iLogReporter<T> {
	generateLogReport(logger: iLogger<T>): string;
}

export interface iLogCollection<T> {
	log(event: iLogEvent<T>): void; 

	toJson(): iLogEvent<T>[];
}

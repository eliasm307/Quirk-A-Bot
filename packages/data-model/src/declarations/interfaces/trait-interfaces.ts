import { iSaveAction, iToJson } from './general-interfaces';
import { iLogger } from './log-interfaces';
import { AttributeCategory, AttributeName, DisciplineName, SkillName, TraitName, TraitValue } from '../types';

/** Describes the shape of the most basic trait */
export interface iTraitData {
	name: string;
	value: number | string; // todo limit to 0-5
}

/** Base interface for Trait Objects */
export interface iBaseTrait extends iTraitData, iToJson<iTraitData>, iLogger {
	// todo add explain method to give a summary what this trait is for
	// todo add explainValue method to describe the current value of the attribute, ie add description getter to describe the meaning of a value
	// todo add min and max limits for trait values, shoud this be done here?
}

export interface iNumberTrait extends iBaseTrait, iNumberValue {
	min: number;
	max: number;
	value: number;
}
export interface iStringTrait extends iBaseTrait, iStringValue {
	value: string;
}

export interface iStringValue {
	value: string;
}

export interface iNumberValue {
	min: number;
	max: number;
	value: number;
}

export interface iBaseTraitProps<T extends iTraitData> {
	saveAction?: () => boolean;
	name: TraitName<T>;
	value: TraitValue<T>;
}
export interface iAbstractNumberTraitProps<T extends iTraitData> extends iBaseTraitProps<T> {
	min?: number;
	max: number;
}

// ? does this need to be a separate inteface?
export interface iAttributeData extends iTraitData, iNumberValue {
	name: AttributeName;
	value: number;
	category: AttributeCategory;
}

// ? does this need to be a separate inteface?
export interface iTouchStoneOrConvictionData extends iTraitData {
	name: string;
	value: string;
}

// ? does this need to be a separate inteface?
export interface iSkillData extends iTraitData, iNumberValue {
	name: SkillName;
	value: number;
}

export interface iDisciplineData extends iTraitData, iNumberValue {
	name: DisciplineName;
	value: number;
	// todo add "specialisation" / sub types?
}

export interface iTraitCollectionArguments<T extends iTraitData> extends iSaveAction {
	instanceCreator: (name: TraitName<T>, value: TraitValue<T>) => T;
}

export interface iTraitCollection<T extends iBaseTrait> extends iToJson<iTraitData[]> {
	get(name: TraitName<T>): T | void;
	set(name: TraitName<T>, value: number): void;
	delete(name: TraitName<T>): void;
	has(name: TraitName<T>): boolean;
	readonly size: number;
}

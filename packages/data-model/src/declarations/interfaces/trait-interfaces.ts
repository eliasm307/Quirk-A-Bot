import { TraitNameUnion } from './../types';
import { iSaveAction, iToJson } from './general-interfaces';
import { iLogger } from './log-interfaces';
import {
	AttributeCategory,
	AttributeName,
	DisciplineName,
	SkillName,
	TraitName,
	TraitValue,
	TraitTypeUnion,
} from '../types';

/** Describes the shape of the most basic trait */
export interface iTraitData {
	name: TraitNameUnion;
	value: TraitTypeUnion;
}

/** Base interface for Trait Objects */
export interface iBaseTrait extends iTraitData, iToJson<iTraitData>, iLogger {
	// todo add explain method to give a summary what this trait is for
	// todo add explainValue method to describe the current value of the attribute, ie add description getter to describe the meaning of a value
	// todo add min and max limits for trait values, shoud this be done here?
}

export interface iNumberTrait extends iBaseTrait, iHasNumberValue {
	min: number;
	max: number;
	value: number;
}
export interface iNumberTraitWithCategory<C extends string> extends iNumberTrait, iHasCategory<C> {}

export interface iHasCategorySelector<N extends string, C extends string> {
	categorySelector: (name: N) => C;
}

export interface iHasCategory<C> {
	category: C;
}
export interface iStringTrait extends iBaseTrait, iStringValue {
	value: string;
}

// ? is this required?
export interface iStringValue {
	value: string;
}

// ? is this required?
export interface iHasNumberValue {
	min: number;
	max: number;
	value: number;
}

export interface iBaseTraitProps<N extends TraitNameUnion, V extends TraitTypeUnion> {
	saveAction?: () => boolean;
	name: N;
	value: V;
}
export interface iNumberTraitProps<N extends TraitNameUnion> extends iBaseTraitProps<N, number> {
	min?: number;
	max: number;
}
export interface iNumberTraitWithCategoryProps<N extends TraitNameUnion, C extends string>
	extends iNumberTraitProps<N> {
	categorySelector: (name: N) => C;
}
export interface iStringTraitProps<N extends TraitNameUnion> extends iBaseTraitProps<N, string> {}

// ? does this need to be a separate inteface?
export interface iAttributeData extends iTraitData, iHasNumberValue {
	name: AttributeName;
	value: number;
	category: AttributeCategory;
}

export interface iAttribute<C extends string> extends iNumberTrait, iHasCategory<C> {}

// ? does this need to be a separate inteface?
export interface iTouchStoneOrConvictionData extends iTraitData {
	name: string;
	value: string;
}

// ? does this need to be a separate inteface?
export interface iSkillData extends iTraitData, iHasNumberValue {
	name: SkillName;
	value: number;
}

export interface iDisciplineData extends iTraitData, iHasNumberValue {
	name: DisciplineName;
	value: number;
	// todo add "specialisation" / sub types?
}

export interface iTraitCollectionArguments<T extends iBaseTrait> extends iSaveAction {
	instanceCreator: (name: TraitNameUnion, value: TraitTypeUnion) => T;
	// todo make this more specific in terms of available names and value types
}

export interface iTraitCollection<T extends iBaseTrait> extends iToJson<iTraitData[]> {
	get(name: TraitName<T>): T | void;
	set(name: TraitName<T>, value: number): void;
	delete(name: TraitName<T>): void;
	has(name: TraitName<T>): boolean;
	readonly size: number;
}

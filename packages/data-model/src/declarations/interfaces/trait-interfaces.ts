import { TraitNameUnion } from './../types';
import { iSaveAction, iToJson } from './general-interfaces';
import { iLogger } from './log-interfaces';
import { AttributeCategory, AttributeName, DisciplineName, SkillName, TraitName, TraitTypeUnion } from '../types';

/** Describes the shape of the most basic trait */
export interface iTraitData<N extends TraitNameUnion | string, V extends TraitTypeUnion> {
	name: N;
	value: V;
}

/** Base interface for Trait Objects */
export interface iBaseTrait<N extends TraitNameUnion, V extends TraitTypeUnion>
	extends iTraitData<N, V>,
		iToJson<iTraitData<N, V>>,
		iLogger {
	// todo add explain method to give a summary what this trait is for
	// todo add explainValue method to describe the current value of the attribute, ie add description getter to describe the meaning of a value
	// todo add min and max limits for trait values, shoud this be done here?
}

export interface iNumberTrait<N extends TraitNameUnion> extends iBaseTrait<N, number>, iHasNumberValue {
	min: number;
	max: number;
}
export interface iNumberTraitWithCategory<N extends TraitNameUnion, C extends string>
	extends iNumberTrait<N>,
		iHasCategory<C> {}

export interface iHasCategorySelector<N extends string, C extends string> {
	categorySelector: (name: N) => C;
}

export interface iHasCategory<C> {
	category: C;
}
export interface iStringTrait<N extends TraitNameUnion, V extends TraitTypeUnion>
	extends iBaseTrait<N, string>,
		iStringValue {}

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

export interface iAttributeData
	extends iTraitData<AttributeName, number>,
		iHasNumberValue,
		iHasCategory<AttributeCategory> {}

export interface iAttribute<C extends string> extends iNumberTrait<AttributeName>, iHasCategory<C> {}

export interface iTouchStoneOrConvictionData extends iTraitData<string, string> {
	name: string;
	value: string;
}

export interface iSkillData extends iTraitData<SkillName, number>, iHasNumberValue {}

export interface iDisciplineData extends iTraitData<DisciplineName, number>, iHasNumberValue {
	// todo add "specialisation" / sub types?
}

// todo is this the best way to do this?
// todo use dynamic types here?
export interface iTraitCollectionArguments<T extends iBaseTrait<TraitNameUnion, TraitTypeUnion>> extends iSaveAction {
	// todo use dynamic types here?
	instanceCreator: (name: TraitNameUnion, value: TraitTypeUnion) => T;
	// todo make this more specific in terms of available names and value types
}

// todo is this the best way to do this?
// todo use dynamic types here?
export interface iTraitCollection<T extends iBaseTrait<TraitNameUnion, TraitTypeUnion>>
	extends iToJson<iTraitData<TraitNameUnion, TraitTypeUnion>[]> {
	get(name: TraitName<T>): T | void;
	set(name: TraitName<T>, value: number): void;
	delete(name: TraitName<T>): void;
	has(name: TraitName<T>): boolean;
	readonly size: number;
}

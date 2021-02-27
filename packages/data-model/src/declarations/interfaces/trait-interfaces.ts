import { CoreTraitName, TraitDataDynamic, TraitNameUnion, TraitNameUnionOrString, TraitValueDynamic } from './../types';
import { iCanHaveSaveAction, iToJson } from './general-interfaces';
import { iLogger } from './log-interfaces';
import {
	AttributeCategory,
	AttributeName,
	DisciplineName,
	SkillName,
	TraitNameDynamic,
	TraitValueTypeUnion,
} from '../types';

export interface iHasCategorySelector<N extends string, C extends string> {
	categorySelector: (name: N) => C;
}

export interface iHasCategory<C> {
	category: C;
}

// ? is this required?
export interface iHasStringValue {
	value: string;
}

// ? is this required?
export interface iHasNumberValue {
	value: number;
}
export interface iHasNumberLimits {
	min: number;
	max: number;
}

// -------------------------------------------------------
// TRAIT PROPS

export interface iBaseTraitProps<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion> {
	saveAction?: () => boolean;
	name: N;
	value: V;
}
export interface iStringTraitProps<N extends TraitNameUnionOrString> extends iBaseTraitProps<N, string> {}
export interface iNumberTraitProps<N extends TraitNameUnionOrString> extends iBaseTraitProps<N, number> {
	min?: number;
	max: number;
}
export interface iNumberTraitWithCategoryProps<N extends TraitNameUnionOrString, C extends string>
	extends iNumberTraitProps<N> {
	categorySelector: (name: N) => C;
}

export interface iInstanceCreatorProps<T extends iTraitData<TraitNameDynamic<T>, TraitValueDynamic<T>>> {
	name: TraitNameDynamic<T>;
	value: TraitValueDynamic<T>;
}
// todo is this the best way to do this?
// todo use dynamic types here?
export interface iTraitCollectionProps<T extends iBaseTrait<TraitNameDynamic<T>, TraitValueDynamic<T>>>
	extends iCanHaveSaveAction {
	// todo use dynamic types here?
	instanceCreator: (props: iInstanceCreatorProps<T>) => T;
	// todo make this more specific in terms of available names and value types
}
// -------------------------------------------------------
// GENERIC TRAIT DATA TYPES

/** Describes the shape of the most basic trait */
export interface iTraitData<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion> {
	name: N;
	value: V;
}
export interface iNumberTraitData<N extends TraitNameUnionOrString> extends iTraitData<N, number>, iHasNumberValue {}
export interface iStringTraitData<N extends TraitNameUnionOrString> extends iTraitData<N, string>, iHasStringValue {}
// -------------------------------------------------------
// SPECIFIC TRAIT DATA TYPES

export interface iAttributeData extends iNumberTraitData<AttributeName>, iHasCategory<AttributeCategory> {}
export interface iTouchStoneOrConvictionData extends iStringTraitData<string> {}
export interface iSkillData extends iNumberTraitData<SkillName> {}
export interface iDisciplineData extends iNumberTraitData<DisciplineName> {
	// todo add "specialisation" / sub types?
} 
// -------------------------------------------------------
// GENERIC TRAIT OBJECTS TYPES

/** Base interface for Trait Objects */
export interface iBaseTrait<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends iTraitData<N, V>,
		iToJson<iTraitData<N, V>>,
		iLogger {
	// todo add explain method to give a summary what this trait is for
	// todo add explainValue method to describe the current value of the attribute, ie add description getter to describe the meaning of a value
	// todo add min and max limits for trait values, shoud this be done here?
}
export interface iNumberTrait<N extends TraitNameUnionOrString>
	extends iBaseTrait<N, number>,
		iHasNumberValue,
		iHasNumberLimits {}
export interface iStringTrait<N extends TraitNameUnionOrString> extends iBaseTrait<N, string>, iHasStringValue {}
export interface iNumberTraitWithCategory<N extends TraitNameUnionOrString, C extends string>
	extends iNumberTrait<N>,
		iHasCategory<C> {}

// -------------------------------------------------------
// SPECIFIC TRAIT OBJECTS

export interface iAttribute extends iAttributeData, iNumberTrait<AttributeName>, iHasCategory<AttributeCategory> {}
export interface iDiscipline extends iDisciplineData, iNumberTrait<DisciplineName> {}
export interface iSkill extends iSkillData, iNumberTrait<SkillName> {}
export interface iTouchStoneOrConviction extends iTouchStoneOrConvictionData, iStringTrait<string> {}

// -------------------------------------------------------
// TRAIT COLLECTION

// todo is this the best way to do this?
// todo use dynamic types here?
export interface iTraitCollection<T extends iBaseTrait<TraitNameUnionOrString, TraitValueTypeUnion>>
	extends iToJson<TraitDataDynamic<T>[]> {
	get(name: TraitNameDynamic<T>): T | void;
	set(name: TraitNameDynamic<T>, value: TraitValueDynamic<T>): void;
	delete(name: TraitNameDynamic<T>): void;
	has(name: TraitNameDynamic<T>): boolean;
	readonly size: number;
}

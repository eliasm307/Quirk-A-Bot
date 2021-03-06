import { iTraitDataStorage, iTraitDataStorageProps } from './data-storage-interfaces';
import {
	TraitNameUnionOrString,
	TraitValueTypeUnion,
	AttributeName,
	SkillName,
	DisciplineName,
	CoreStringTraitName,
	CoreNumberTraitName,
	AttributeCategory,
} from '../types';
import { iCanHaveSaveAction, iToJson } from './general-interfaces';
import { iLoggerSingle } from './log-interfaces';

export interface iHasCategorySelector<N extends string, C extends string> {
	categorySelector: (name: N) => C;
}

export interface iHasCategory<C extends string> {
	category: C;
}

export interface iHasStringValue<V extends string> {
	value: V;
}

export interface iHasNumberValue {
	value: number;
}
export interface iHasNumberLimits {
	min: number;
	max: number;
}

// -------------------------------------------------------
// TRAIT PROPS

export interface iBaseTraitProps<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iTraitData<N, V>
>   {
	name: N;
	value?: V;
	toJson?: () => D;
	dataStorageInitialiser(props: iTraitDataStorageProps<N, V>): iTraitDataStorage<N, V>
}
export interface iStringTraitProps<N extends TraitNameUnionOrString, V extends string>
	extends iBaseTraitProps<N, V, iStringTraitData<N, V>> {}

export interface iBaseNumberTraitProps<N extends TraitNameUnionOrString, D extends iNumberTraitData<N>>
	extends iBaseTraitProps<N, number, D> {
	min?: number;
	max: number;
}

export interface iNumberTraitProps<N extends TraitNameUnionOrString>
	extends iBaseNumberTraitProps<N, iNumberTraitData<N>> {}

export interface iNumberTraitWithCategoryProps<N extends TraitNameUnionOrString, C extends string>
	extends iBaseNumberTraitProps<N, iNumberTraitData<N>> {
	categorySelector: (name: N) => C;
}

export interface iTraitCollectionProps<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends iCanHaveSaveAction {
	name: string;
	instanceCreator: (props: iBaseTraitProps<N, V, D>) => T;
}
// -------------------------------------------------------
// GENERIC TRAIT DATA TYPES
// NOTE These should only contain user defined data, not computed properties such as categories based on trait names

/** Describes the shape of the most basic trait */
export interface iTraitData<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion> {
	name: N;
	value: V;
}
export interface iGeneralTraitData extends iTraitData<TraitNameUnionOrString, TraitValueTypeUnion> {}
export interface iNumberTraitData<N extends TraitNameUnionOrString> extends iTraitData<N, number>, iHasNumberValue {}
export interface iStringTraitData<N extends TraitNameUnionOrString, V extends string>
	extends iTraitData<N, V>,
		iHasStringValue<V> {}
// -------------------------------------------------------
// SPECIFIC TRAIT DATA TYPES
// NOTE Data should only contain user defined data

export interface iAttributeData extends iNumberTraitData<AttributeName> {}
export interface iTouchStoneOrConvictionData extends iStringTraitData<string, string> {}
export interface iSkillData extends iNumberTraitData<SkillName> {}
export interface iDisciplineData extends iNumberTraitData<DisciplineName> {
	// todo add "specialisation" / sub types?
}
export interface iCoreStringTraitData<V extends string> extends iStringTraitData<CoreStringTraitName, V> {}
export interface iCoreNumberTraitData extends iNumberTraitData<CoreNumberTraitName> {}
// -------------------------------------------------------
// GENERIC TRAIT OBJECTS TYPES

/** Base interface for Trait Objects */
export interface iBaseTrait<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iTraitData<N, V>
> extends iTraitData<N, V>,
		iToJson<D>, 
		iLoggerSingle {
	// todo add explain method to give a summary what this trait is for
	// todo add explainValue method to describe the current value of the attribute, ie add description getter to describe the meaning of a value
}

export interface iGeneralTrait extends iBaseTrait<TraitNameUnionOrString, TraitValueTypeUnion, iGeneralTraitData> {}

export interface iBaseNumberTrait<N extends TraitNameUnionOrString, D extends iNumberTraitData<N>>
	extends iBaseTrait<N, number, D>,
		iHasNumberValue,
		iHasNumberLimits {}

export interface iNumberTrait<N extends TraitNameUnionOrString> extends iBaseNumberTrait<N, iNumberTraitData<N>> {}

export interface iBaseStringTrait<N extends TraitNameUnionOrString, V extends string>
	extends iBaseTrait<N, V, iTraitData<N, V>> {}

export interface iStringTrait<N extends TraitNameUnionOrString> extends iBaseStringTrait<N, string> {}

export interface iNumberTraitWithCategory<N extends TraitNameUnionOrString, C extends string>
	extends iNumberTrait<N>,
		iHasCategory<C> {}

// -------------------------------------------------------
// SPECIFIC TRAIT OBJECTS

export interface iAttribute extends iAttributeData, iNumberTrait<AttributeName>, iHasCategory<AttributeCategory> {}
export interface iDiscipline extends iDisciplineData, iNumberTrait<DisciplineName> {}
export interface iSkill extends iSkillData, iNumberTrait<SkillName> {}
export interface iTouchStoneOrConviction extends iTouchStoneOrConvictionData, iStringTrait<string> {}
export interface iCoreNumberTrait extends iNumberTraitData<CoreNumberTraitName>, iNumberTrait<CoreNumberTraitName> {}
export interface iCoreStringTrait<V extends string>
	extends iTraitData<CoreStringTraitName, V>,
		iBaseStringTrait<CoreStringTraitName, V> {}

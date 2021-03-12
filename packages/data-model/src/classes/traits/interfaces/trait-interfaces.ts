import {
  iCanHaveGetData, iHasCleanUp, iHasGetData, iHasParentPath, iHasPath
} from '../../../declarations/interfaces';
import {
  AttributeCategory, AttributeName, CoreNumberTraitName, CoreStringTraitName, DisciplineName,
  SkillName, TraitNameUnionOrString, TraitValueTypeUnion
} from '../../../declarations/types';
import {
  iHasTraitDataStorageInitialiser
} from '../../data-storage/interfaces/data-storage-interfaces';
import {
  iBaseLogger, iBaseLogReport, iChildLoggerCreatorProps, iHasLogReporter, iTraitCollectionLogger,
  iTraitLogger, iTraitLogReporter
} from '../../log/interfaces/log-interfaces';
import { iTraitCollectionDataStorageInitialiserBundle } from './trait-collection-interfaces';

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
	max: number;
	min: number;
}
export interface iHasTraitInstanceCreator<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> {
	instanceCreator: (props: iBaseTraitProps<N, V, D>) => T;

// todo this should only require name and value, everything else should be pre configured
}
// -------------------------------------------------------
// TRAIT PROPS

export interface iBaseTraitProps<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>
> extends iHasTraitDataStorageInitialiser,
		iHasParentPath,
		iCanHaveGetData<D>,
		iCanHaveLoggerCreator<iTraitLogger> {
	name: N;
	value: V;
}
export interface iStringTraitProps<N extends TraitNameUnionOrString, V extends string>
	extends iBaseTraitProps<N, V, iStringTraitData<N, V>> {}

export interface iBaseNumberTraitProps<N extends TraitNameUnionOrString, D extends iNumberTraitData<N>>
	extends iBaseTraitProps<N, number, D> {
	max: number;
	min?: number;
}

export interface iNumberTraitProps<N extends TraitNameUnionOrString>
	extends iBaseNumberTraitProps<N, iNumberTraitData<N>> {}

export interface iNumberTraitWithCategoryProps<N extends TraitNameUnionOrString, C extends string>
	extends iBaseNumberTraitProps<N, iNumberTraitData<N>> {
	categorySelector: (name: N) => C;
}

// todo relocate
export interface iCanHaveLoggerCreator<L extends iBaseLogger<iBaseLogReport>> {
	loggerCreator: ((props: iChildLoggerCreatorProps) => L) | null;

// todo rename to loggerCreator
}

/*
// todo relocate
export interface iCanHaveTraitCollectionLogger {
	logger: iTraitCollectionLogger | null;
}
// todo relocate
export interface iCanHaveCharacterSheetLogger {
	logger: iCharacterSheetLogger | null;
}
*/

export interface iTraitCollectionProps<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends iHasTraitInstanceCreator<N, V, D, T>,
		iTraitCollectionDataStorageInitialiserBundle,
		iHasParentPath,
		iCanHaveLoggerCreator<iTraitCollectionLogger> {
	name: string;
}
// -------------------------------------------------------
// GENERIC TRAIT DATA TYPES
// NOTE These should only contain user defined data, not computed properties such as categories based on trait names

/** Defines the most basic shape of a trait */
export interface iBaseTraitShape {
	name: string;
	value: any;
}

/** Describes the shape of trait data with generic types */
export interface iBaseTraitData<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends iBaseTraitShape {
	name: N;
	value: V;
}
export interface iGeneralTraitData extends iBaseTraitData<TraitNameUnionOrString, TraitValueTypeUnion> {}

export interface iNumberTraitData<N extends TraitNameUnionOrString>
	extends iBaseTraitData<N, number>,
		iHasNumberValue {}

export interface iStringTraitData<N extends TraitNameUnionOrString, V extends string>
	extends iBaseTraitData<N, V>,
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
	D extends iBaseTraitData<N, V>
> extends iBaseTraitData<N, V>,
		iHasGetData<D>,
		iHasLogReporter<iTraitLogReporter>,
		iHasPath,
		iHasCleanUp {
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
	extends iBaseTrait<N, V, iBaseTraitData<N, V>> {}

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
	extends iBaseTraitData<CoreStringTraitName, V>,
		iBaseStringTrait<CoreStringTraitName, V> {}

import { AttributeName, SkillName, DisciplineName } from './../types';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../types';
import { iBaseCollection, iHasToJson, iHasPath, iHasParentPath, iHasCleanUp } from './general-interfaces';
import { iHasLogReporter, iTraitCollectionLogger } from './log-interfaces';
import {
	iAttribute,
	iBaseTrait,
	iSkill,
	iBaseTraitData,
	iDiscipline,
	iTouchStoneOrConviction,
	iAttributeData,
	iDisciplineData,
	iSkillData,
	iTouchStoneOrConvictionData,
	iGeneralTraitData,
	iGeneralTrait,
} from './trait-interfaces';
import { iHasTraitCollectionDataStorageInitialiser, iHasTraitDataStorageInitialiser } from './data-storage-interfaces';

// -------------------------------------------------------
// GENERAL

export interface iTraitCollectionDataStorageInitialiserBundle
	extends iHasTraitCollectionDataStorageInitialiser,
		iHasTraitDataStorageInitialiser {}

// -------------------------------------------------------
// FACTORY METHOD PROPS

export interface iTraitCollectionFactoryMethodProps
	extends iTraitCollectionDataStorageInitialiserBundle,
		iHasParentPath {}

// -------------------------------------------------------
// BASE TRAIT COLLECTION TYPES

/** Shape of a custom trait collection with logging */
export interface iTraitCollection<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends iBaseCollection<N, V, T, iTraitCollection<N, V, D, T>>,
		iHasToJson<D[]>,
		iHasLogReporter<iTraitCollectionLogger>,
		iHasPath,
		iHasCleanUp {
	name: string;
}

// -------------------------------------------------------
// SPECIFIC TRAIT COLLECTION TYPES

export interface iGeneralTraitCollection
	extends iTraitCollection<TraitNameUnionOrString, TraitValueTypeUnion, iGeneralTraitData, iGeneralTrait> {}

export interface iAttributeTraitCollection
	extends iTraitCollection<AttributeName, number, iAttributeData, iAttribute> {}

export interface iSkillTraitCollection extends iTraitCollection<SkillName, number, iSkillData, iSkill> {}

export interface iDisciplineTraitCollection
	extends iTraitCollection<DisciplineName, number, iDisciplineData, iDiscipline> {}

export interface iTouchStoneOrConvictionCollection
	extends iTraitCollection<string, string, iTouchStoneOrConvictionData, iTouchStoneOrConviction> {}

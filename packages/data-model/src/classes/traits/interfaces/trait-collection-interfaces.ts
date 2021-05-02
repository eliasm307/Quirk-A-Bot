import {
  iBaseCollection, iHasCleanUp, iHasGetData, iHasParentPath, iHasPath,
} from '../../../declarations/interfaces';
import {
  AttributeName, DisciplineName, SkillName, TraitNameUnionOrString, TraitValueTypeUnion,
} from '../../../declarations/types';
import {
  iHasTraitCollectionDataStorageInitialiser, iHasTraitDataStorageInitialiser,
} from '../../data-storage/interfaces/data-storage-interfaces';
import {
  iHasTraitCollectionLogReporter, iTraitCollectionLogger,
} from '../../log/interfaces/log-interfaces';
import {
  iAttribute, iAttributeData, iBaseTrait, iBaseTraitData, iCanHaveLoggerCreator, iDiscipline,
  iDisciplineData, iGeneralTrait, iGeneralTraitData, iSkill, iSkillData, iTouchStoneOrConviction,
  iTouchStoneOrConvictionData,
} from './trait-interfaces';

// -------------------------------------------------------
// GENERAL

export interface iTraitCollectionDataStorageInitialiserBundle
  extends iHasTraitCollectionDataStorageInitialiser,
    iHasTraitDataStorageInitialiser {}

// -------------------------------------------------------
// FACTORY METHOD PROPS

export interface iTraitCollectionFactoryMethodProps
  extends iTraitCollectionDataStorageInitialiserBundle,
    iHasParentPath,
    iCanHaveLoggerCreator<iTraitCollectionLogger> {}

// -------------------------------------------------------
// BASE TRAIT COLLECTION TYPES

/** Shape of a custom trait collection with logging */
export interface iTraitCollection<
  N extends TraitNameUnionOrString = string,
  V extends TraitValueTypeUnion = TraitValueTypeUnion,
  D extends iBaseTraitData<N, V> = iBaseTraitData<N, V>,
  T extends iBaseTrait<N, V, D> = iBaseTrait<N, V, D>
> extends iBaseCollection<N, V, T, iTraitCollection<N, V, D, T>>,
    iHasGetData<D[]>,
    iHasTraitCollectionLogReporter,
    iHasPath,
    iHasCleanUp {
  name: string;
}

// -------------------------------------------------------
// SPECIFIC TRAIT COLLECTION TYPES

export interface iGeneralTraitCollection
  extends iTraitCollection<
    TraitNameUnionOrString,
    TraitValueTypeUnion,
    iGeneralTraitData,
    iGeneralTrait
  > {}

export interface iAttributeTraitCollection
  extends iTraitCollection<AttributeName, number, iAttributeData, iAttribute> {}

export interface iSkillTraitCollection
  extends iTraitCollection<SkillName, number, iSkillData, iSkill> {}

export interface iDisciplineTraitCollection
  extends iTraitCollection<
    DisciplineName,
    number,
    iDisciplineData,
    iDiscipline
  > {}

export interface iTouchStoneOrConvictionCollection
  extends iTraitCollection<
    string,
    string,
    iTouchStoneOrConvictionData,
    iTouchStoneOrConviction
  > {}

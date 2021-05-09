import { CoreNumberTraitName, CoreStringTraitName } from '@quirk-a-bot/common';

import {
  iBaseCollection, iHasCleanUp, iHasGetData, iHasParentPath, iHasPath,
} from '../../../declarations/interfaces';
import {
  AttributeName, DisciplineName, SkillName, TraitNameUnionOrString, TraitValueTypeUnion,
} from '../../../declarations/types';
import {
  iHasTraitDataStorageInitialiser, iTraitCollectionDataStorage,
} from '../../data-storage/interfaces/data-storage-interfaces';
import {
  iBaseTraitCollectionDataStorageProps,
} from '../../data-storage/interfaces/props/trait-collection-data-storage';
import {
  iHasTraitCollectionLogReporter, iTraitCollectionLogger,
} from '../../log/interfaces/log-interfaces';
import {
  iAttribute, iAttributeData, iBaseTrait, iBaseTraitData, iCanHaveLoggerCreator, iCoreNumberTrait,
  iCoreNumberTraitData, iCoreStringTrait, iCoreStringTraitData, iDiscipline, iDisciplineData,
  iGeneralTrait, iGeneralTraitData, iSkill, iSkillData, iTouchStoneOrConviction,
  iTouchStoneOrConvictionData,
} from './trait-interfaces';

// -------------------------------------------------------
// GENERAL

export interface iTraitCollectionDataStorageInitialiserBundle {
  traitCollectionDataStorageInitialiser<
    N extends TraitNameUnionOrString,
    V extends TraitValueTypeUnion,
    D extends iBaseTraitData<N, V>,
    T extends iBaseTrait<N, V, D>
  >(
    props: Omit<
      iBaseTraitCollectionDataStorageProps<N, V, D, T>,
      "newTraitDataStorage"
    >
  ): iTraitCollectionDataStorage<N, V, D, T>;
}

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

export interface iCoreNumberTraitCollection
  extends iTraitCollection<
    CoreNumberTraitName,
    number,
    iCoreNumberTraitData,
    iCoreNumberTrait
  > {}

export interface iCoreStringTraitCollection
  extends iTraitCollection<
    CoreStringTraitName,
    string,
    iCoreStringTraitData<string>,
    iCoreStringTrait<string>
  > {}

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

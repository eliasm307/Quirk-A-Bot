import {
  isAttributeName, isCoreNumberTraitName, isCoreStringTraitName, isDisciplineName, isSkillName,
  isString,
} from '@quirk-a-bot/common';

import {
  ATTRIBUTE_COLLECTION_NAME, CORE_TRAIT_COLLECTION_NAME, DISCIPLINE_COLLECTION_NAME,
  SKILL_COLLECTION_NAME, TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME,
} from '../../../../common/src/constants';
import {
  AttributeName, CoreNumberTraitName, CoreStringTraitName, DisciplineName, SkillName,
} from '../../declarations/types';
import isTraitData from '../../utils/type-predicates/isTraitData';
import {
  iAttributeTraitCollection, iCoreNumberTraitCollection, iCoreStringTraitCollection,
  iDisciplineTraitCollection, iSkillTraitCollection, iTouchStoneOrConvictionCollection,
  iTraitCollectionFactoryMethodProps,
} from './interfaces/trait-collection-interfaces';
import {
  iAttribute, iAttributeData, iBaseTraitProps, iCoreNumberTrait, iCoreNumberTraitData,
  iCoreStringTrait, iCoreStringTraitData, iDiscipline, iDisciplineData, iSkill, iSkillData,
  iStringTraitProps, iTouchStoneOrConviction, iTouchStoneOrConvictionData,
} from './interfaces/trait-interfaces';
import TraitCollection from './trait-collection/TraitCollection';
import NumberTrait from './trait/NumberTrait';
import NumberTraitWithCategory from './trait/NumberTraitWithCategory';
import StringTrait from './trait/StringTrait';
import getAttributeCategory from './utils/categoryFunctions/getAttributeCategory';
import { coreNumberTraitMax } from './utils/numberTraitLimits';

export default abstract class TraitFactory {
  static newAttributeTraitCollection(
    props: iTraitCollectionFactoryMethodProps,
    ...initialData: iAttributeData[]
  ): iAttributeTraitCollection {
    return new TraitCollection<
      AttributeName,
      number,
      iAttributeData,
      iAttribute
    >(
      {
        ...props,
        name: ATTRIBUTE_COLLECTION_NAME,
        instanceCreator: TraitFactory.newAttributeTrait,
        dataPredicate: isTraitData,
        namePredicate: isAttributeName,
      },
      ...initialData
    );
  }

  static newCoreNumberTraitCollection(
    props: iTraitCollectionFactoryMethodProps,
    ...initialData: iCoreNumberTraitData[]
  ): iCoreNumberTraitCollection {
    return new TraitCollection<
      CoreNumberTraitName,
      number,
      iCoreNumberTraitData,
      iCoreNumberTrait
    >(
      {
        ...props,
        name: CORE_TRAIT_COLLECTION_NAME,
        instanceCreator: TraitFactory.newCoreNumberTrait,
        dataPredicate: isTraitData,
        namePredicate: isCoreNumberTraitName,
      },
      ...initialData
    );
  }

  static newCoreStringTraitCollection(
    props: iTraitCollectionFactoryMethodProps,
    ...initialData: iCoreStringTraitData[]
  ): iCoreStringTraitCollection {
    return new TraitCollection<
      CoreStringTraitName,
      string,
      iCoreStringTraitData,
      iCoreStringTrait
    >(
      {
        ...props,
        name: CORE_TRAIT_COLLECTION_NAME,
        instanceCreator: TraitFactory.newCoreStringTrait,
        dataPredicate: isTraitData,
        namePredicate: isCoreStringTraitName,
      },
      ...initialData
    );
  }

  static newDisciplineTraitCollection(
    props: iTraitCollectionFactoryMethodProps,
    ...initialData: iDisciplineData[]
  ): iDisciplineTraitCollection {
    return new TraitCollection<
      DisciplineName,
      number,
      iDisciplineData,
      iDiscipline
    >(
      {
        ...props,
        name: DISCIPLINE_COLLECTION_NAME,
        instanceCreator: TraitFactory.newDisciplineTrait,
        dataPredicate: isTraitData,
        namePredicate: isDisciplineName,
      },
      ...initialData
    );
  }

  static newSkillTraitCollection(
    props: iTraitCollectionFactoryMethodProps,
    ...initialData: iSkillData[]
  ): iSkillTraitCollection {
    return new TraitCollection<SkillName, number, iSkillData, iSkill>(
      {
        ...props,
        name: SKILL_COLLECTION_NAME,
        instanceCreator: TraitFactory.newSkillTrait,
        dataPredicate: isTraitData,
        namePredicate: isSkillName,
      },
      ...initialData
    );
  }

  static newTouchstonesAndConvictionTraitCollection(
    props: iTraitCollectionFactoryMethodProps,
    ...initialData: iTouchStoneOrConvictionData[]
  ): iTouchStoneOrConvictionCollection {
    return new TraitCollection<
      string,
      string,
      iTouchStoneOrConvictionData,
      iTouchStoneOrConviction
    >(
      {
        ...props,
        name: TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME,
        instanceCreator: TraitFactory.newTouchStoneOrConvictionTrait,
        dataPredicate: isTraitData,
        namePredicate: isString,
      },
      ...initialData
    );
  }

  protected static newAttributeTrait({
    value = 0,
    ...restProps
  }: iBaseTraitProps<AttributeName, number, iAttributeData>): iAttribute {
    return new NumberTraitWithCategory({
      categorySelector: getAttributeCategory,
      ...restProps,
      value,
      min: 1,
      max: 5,
    });
  }

  protected static newCoreNumberTrait({
    value = 0,
    name,
    ...restProps
  }: iBaseTraitProps<CoreNumberTraitName, number, iCoreNumberTraitData>) {
    const max = coreNumberTraitMax(name);
    return new NumberTrait({ ...restProps, name, value, min: 0, max });
  }

  protected static newCoreStringTrait<V extends string>(
    props: iStringTraitProps<CoreStringTraitName, V>
  ) {
    return new StringTrait(props);
  }

  protected static newDisciplineTrait({
    value,
    ...restProps
  }: iBaseTraitProps<DisciplineName, number, iDisciplineData>): iDiscipline {
    return new NumberTrait({ ...restProps, value, min: 1, max: 5 });
  }

  protected static newSkillTrait({
    value = 0,
    ...restProps
  }: iBaseTraitProps<SkillName, number, iSkillData>): iSkill {
    return new NumberTrait({ ...restProps, min: 0, max: 5, value });
  }

  protected static newTouchStoneOrConvictionTrait({
    value,
    ...restProps
  }: iBaseTraitProps<
    string,
    string,
    iTouchStoneOrConvictionData
  >): iTouchStoneOrConviction {
    return new StringTrait({ ...restProps, value });
  }
}

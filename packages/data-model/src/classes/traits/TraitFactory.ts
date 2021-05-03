import { isAttributeName, isDisciplineName, isSkillName, isString } from '@quirk-a-bot/common';

import {
  ATTRIBUTE_COLLECTION_NAME, DISCIPLINE_COLLECTION_NAME, SKILL_COLLECTION_NAME,
  TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME,
} from '../../../../common/src/constants';
import {
  AttributeName, CoreNumberTraitName, CoreStringTraitName, DisciplineName, SkillName,
} from '../../declarations/types';
import isTraitData from '../../utils/type-predicates/isTraitData';
import {
  iAttributeTraitCollection, iDisciplineTraitCollection, iSkillTraitCollection,
  iTouchStoneOrConvictionCollection, iTraitCollectionFactoryMethodProps,
} from './interfaces/trait-collection-interfaces';
import {
  iAttribute, iAttributeData, iBaseTraitProps, iCoreNumberTrait, iCoreNumberTraitData, iDiscipline,
  iDisciplineData, iNumberTraitProps, iSkill, iSkillData, iStringTraitProps,
  iTouchStoneOrConviction, iTouchStoneOrConvictionData,
} from './interfaces/trait-interfaces';
import TraitCollection from './trait-collection/TraitCollection';
import NumberTrait from './trait/NumberTrait';
import NumberTraitWithCategory from './trait/NumberTraitWithCategory';
import StringTrait from './trait/StringTrait';
import getAttributeCategory from './utils/categoryFunctions/getAttributeCategory';

export default abstract class TraitFactory {
  static newAttributeTraitCollection(
    props: iTraitCollectionFactoryMethodProps<
      AttributeName,
      number,
      iAttributeData
    >,
    ...initial: iAttributeData[]
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
      ...initial
    );
  }

  static newCoreNumberTraitCollection(
    props: iTraitCollectionFactoryMethodProps<
      CoreNumberTraitName,
      number,
      iCoreNumberTraitData
    >,
    ...initial: iCoreNumberTraitData[]
  ): iAttributeTraitCollection {
    return new TraitCollection<
      CoreNumberTraitName,
      number,
      iCoreNumberTraitData,
      iCoreNumberTrait
    >(
      {
        ...props,
        name: ATTRIBUTE_COLLECTION_NAME,
        instanceCreator: TraitFactory.newCoreNumberTrait,
        dataPredicate: isTraitData,
        namePredicate: isCoreN,
      },
      ...initial
    );
  }

  static newDisciplineTraitCollection(
    props: iTraitCollectionFactoryMethodProps<
      DisciplineName,
      number,
      iDisciplineData
    >,
    ...initial: iDisciplineData[]
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
      ...initial
    );
  }

  static newSkillTraitCollection(
    props: iTraitCollectionFactoryMethodProps<SkillName, number, iSkillData>,
    ...initial: iSkillData[]
  ): iSkillTraitCollection {
    return new TraitCollection<SkillName, number, iSkillData, iSkill>(
      {
        ...props,
        name: SKILL_COLLECTION_NAME,
        instanceCreator: TraitFactory.newSkillTrait,
        dataPredicate: isTraitData,
        namePredicate: isSkillName,
      },
      ...initial
    );
  }

  static newTouchstonesAndConvictionTraitCollection(
    props: iTraitCollectionFactoryMethodProps<
      string,
      string,
      iTouchStoneOrConvictionData
    >,
    ...initial: iTouchStoneOrConvictionData[]
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
      ...initial
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
    min = 0,
    ...restProps
  }: iNumberTraitProps<CoreNumberTraitName>) {
    return new NumberTrait({ ...restProps, value, min });
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

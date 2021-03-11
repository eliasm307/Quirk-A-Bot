import {
  ATTRIBUTE_COLLECTION_NAME, DISCIPLINE_COLLECTION_NAME, SKILL_COLLECTION_NAME,
  TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME
} from '../../constants';
import {
  iAttributeTraitCollection, iDisciplineTraitCollection, iSkillTraitCollection,
  iTouchStoneOrConvictionCollection, iTraitCollectionFactoryMethodProps
} from '../../declarations/interfaces/trait-collection-interfaces';
import {
  iAttribute, iAttributeData, iBaseTraitProps, iDiscipline, iDisciplineData, iNumberTraitProps,
  iNumberTraitWithCategoryProps, iSkill, iSkillData, iStringTraitProps, iTouchStoneOrConviction,
  iTouchStoneOrConvictionData
} from '../../declarations/interfaces/trait-interfaces';
import {
  AttributeCategory, AttributeName, CoreNumberTraitName, CoreStringTraitName, DisciplineName,
  SkillName, TraitNameUnionOrString
} from '../../declarations/types';
import getAttributeCategory from '../../utils/getAttributeCategory';
import NumberTrait from './NumberTrait';
import NumberTraitWithCategory from './NumberTraitWithCategory';
import StringTrait from './StringTrait';
import TraitCollection from './TraitCollection';

export default abstract class TraitFactory {
  static newAttributeTrait({
		name,
		value = 0,
		parentPath,
		traitDataStorageInitialiser,
	}: iBaseTraitProps<AttributeName, number, iAttributeData>): iAttribute {
		const props: iNumberTraitWithCategoryProps<AttributeName, AttributeCategory> = {
			categorySelector: getAttributeCategory,
			min: 1,
			max: 5,
			name,
			value,
			traitDataStorageInitialiser,
			parentPath,
		};

		return new NumberTraitWithCategory(props);
	}

  static newAttributeTraitCollection(
		props: iTraitCollectionFactoryMethodProps,
		...initial: iAttributeData[]
	): iAttributeTraitCollection {
		const {} = props || {};
		return new TraitCollection<AttributeName, number, iAttributeData, iAttribute>(
			{
				...props,
				name: ATTRIBUTE_COLLECTION_NAME,
				instanceCreator: TraitFactory.newAttributeTrait,
			},
			...initial
		);
	}

  static newCoreNumberTrait({
		name,
		value = 0,
		traitDataStorageInitialiser,
		max,
		min = 0,
		parentPath,
	}: iNumberTraitProps<CoreNumberTraitName>) {
		return new NumberTrait({ name, value, parentPath, traitDataStorageInitialiser, max, min });
	}

  static newCoreStringTrait<V extends string>(props: iStringTraitProps<CoreStringTraitName, V>) {
		return new StringTrait(props);
	}

  static newDisciplineTrait({
		name,
		value = 0,
		parentPath,
		traitDataStorageInitialiser,
	}: iBaseTraitProps<DisciplineName, number, iDisciplineData>): iDiscipline {
		const props: iNumberTraitProps<DisciplineName> = {
			min: 1,
			max: 5,
			name,
			value,
			parentPath,
			traitDataStorageInitialiser,
		};

		return new NumberTrait(props);
	}

  static newDisciplineTraitCollection(
		props: iTraitCollectionFactoryMethodProps,
		...initial: iDisciplineData[]
	): iDisciplineTraitCollection {
		const {} = props || {};
		return new TraitCollection<DisciplineName, number, iDisciplineData, iDiscipline>(
			{
				...props,
				name: DISCIPLINE_COLLECTION_NAME,
				instanceCreator: TraitFactory.newDisciplineTrait,
			},
			...initial
		);
	}

  static newNumberTrait({
		name,
		value = 0,
		parentPath,
		traitDataStorageInitialiser,
		max,
		min = 0,
	}: iNumberTraitProps<TraitNameUnionOrString>) {
		return new NumberTrait({ name, value, parentPath, traitDataStorageInitialiser, max, min });
	}

  static newSkillTrait({
		name,
		value = 0,
		parentPath,
		traitDataStorageInitialiser,
	}: iBaseTraitProps<SkillName, number, iSkillData>): iSkill {
		const props: iNumberTraitProps<SkillName> = {
			min: 0,
			max: 5,
			name,
			value,
			parentPath,
			traitDataStorageInitialiser,
		};

		return new NumberTrait(props);
	}

  static newSkillTraitCollection(
		props: iTraitCollectionFactoryMethodProps,
		...initial: iSkillData[]
	): iSkillTraitCollection {
		const {} = props || {};
		return new TraitCollection<SkillName, number, iSkillData, iSkill>(
			{
				...props,
				name: SKILL_COLLECTION_NAME,
				instanceCreator: TraitFactory.newSkillTrait,
			},
			...initial
		);
	}

  // methods use base trait props as all other details should be selected to match the required trait type
  static newStringTrait<V extends string>(props: iStringTraitProps<TraitNameUnionOrString, V>) {
		return new StringTrait(props);
	}

  static newTouchStoneOrConvictionTrait({
		name,
		value,
		traitDataStorageInitialiser,
		parentPath,
	}: iBaseTraitProps<string, string, iTouchStoneOrConvictionData>): iTouchStoneOrConviction {
		const props: iStringTraitProps<string, string> = {
			name,
			value,
			parentPath,
			traitDataStorageInitialiser,
		};

		return new StringTrait(props);
	}

  static newTouchstonesAndConvictionTraitCollection(
		props: iTraitCollectionFactoryMethodProps,
		...initial: iTouchStoneOrConvictionData[]
	): iTouchStoneOrConvictionCollection {
		const {} = props || {};
		return new TraitCollection<string, string, iTouchStoneOrConvictionData, iTouchStoneOrConviction>(
			{
				...props,
				name: TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME,
				instanceCreator: TraitFactory.newTouchStoneOrConvictionTrait,
			},
			...initial
		);
	}
}

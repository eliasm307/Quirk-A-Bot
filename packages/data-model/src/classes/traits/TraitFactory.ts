import {
  ATTRIBUTE_COLLECTION_NAME, DISCIPLINE_COLLECTION_NAME, SKILL_COLLECTION_NAME,
  STRING_TRAIT_DEFAULT_VALUE, TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME
} from '../../constants';
import {
  AttributeName, CoreNumberTraitName, CoreStringTraitName, DisciplineName, SkillName,
  TraitNameUnionOrString
} from '../../declarations/types';
import {
  iAttributeTraitCollection, iDisciplineTraitCollection, iSkillTraitCollection,
  iTouchStoneOrConvictionCollection, iTraitCollectionFactoryMethodProps
} from './interfaces/trait-collection-interfaces';
import {
  iAttribute, iAttributeData, iBaseTraitProps, iDiscipline, iDisciplineData, iNumberTraitProps,
  iSkill, iSkillData, iStringTraitProps, iTouchStoneOrConviction, iTouchStoneOrConvictionData
} from './interfaces/trait-interfaces';
import NumberTrait from './NumberTrait';
import NumberTraitWithCategory from './NumberTraitWithCategory';
import StringTrait from './StringTrait';
import TraitCollection from './TraitCollection';
import getAttributeCategory from './utils/categoryFunctions/getAttributeCategory';

export default abstract class TraitFactory {
	static newAttributeTrait({
		value = 0,
		...restProps
	}: iBaseTraitProps<AttributeName, number, iAttributeData>): iAttribute {
		return new NumberTraitWithCategory({ categorySelector: getAttributeCategory, ...restProps, value, min: 1, max: 5 });
	}

	static newAttributeTraitCollection(
		props: iTraitCollectionFactoryMethodProps,
		...initial: iAttributeData[]
	): iAttributeTraitCollection {
		return new TraitCollection<AttributeName, number, iAttributeData, iAttribute>(
			{
				...props,
				name: ATTRIBUTE_COLLECTION_NAME,
				instanceCreator: TraitFactory.newAttributeTrait,
			},
			...initial
		);
	}

	static newCoreNumberTrait({ value = 0, min = 0, ...restProps }: iNumberTraitProps<CoreNumberTraitName>) {
		return new NumberTrait({ ...restProps, value, min });
	}

	static newCoreStringTrait<V extends string>(props: iStringTraitProps<CoreStringTraitName, V>) {
		return new StringTrait(props);
	}

	static newDisciplineTrait({
		value = 0,
		...restProps
	}: iBaseTraitProps<DisciplineName, number, iDisciplineData>): iDiscipline {
		return new NumberTrait({ ...restProps, value, min: 1, max: 5 });
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

	static newNumberTrait({ value = 0, min = 0, ...restProps }: iNumberTraitProps<TraitNameUnionOrString>) {
		return new NumberTrait({ ...restProps, value, min });
	}

	static newSkillTrait({ value = 0, ...restProps }: iBaseTraitProps<SkillName, number, iSkillData>): iSkill {
		return new NumberTrait({ ...restProps, min: 0, max: 5, value });
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
		value = STRING_TRAIT_DEFAULT_VALUE,
		...restProps
	}: iBaseTraitProps<string, string, iTouchStoneOrConvictionData>): iTouchStoneOrConviction {
		return new StringTrait({ ...restProps, value });
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

import {
	iDisciplineTraitCollection,
	iSkillTraitCollection,
	iTouchStoneOrConvictionCollection,
	iTraitCollectionFactoryMethodProps,
} from './../../declarations/interfaces/trait-collection-interfaces';
import {
	AttributeName,
	AttributeCategory,
	DisciplineName,
	SkillName,
	TraitNameUnionOrString,
	CoreNumberTraitName,
	CoreStringTraitName,
} from './../../declarations/types';
import {
	iNumberTraitWithCategoryProps,
	iAttribute,
	iDiscipline,
	iAttributeData,
	iNumberTraitProps,
	iSkill,
	iStringTraitProps,
	iTouchStoneOrConviction,
	iBaseTraitProps,
	iDisciplineData,
	iTouchStoneOrConvictionData,
	iSkillData,
} from './../../declarations/interfaces/trait-interfaces';
import NumberTraitWithCategory from './NumberTraitWithCategory';
import NumberTrait from './NumberTrait';
import StringTrait from './StringTrait';
import getAttributeCategory from '../../utils/getAttributeCategory';
import TraitCollection from './TraitCollection';
import { iAttributeTraitCollection } from '../../declarations/interfaces/trait-collection-interfaces'; 

export default abstract class TraitFactory {
	// methods use base trait props as all other details should be selected to match the required trait type
	static newStringTrait<V extends string>(props: iStringTraitProps<TraitNameUnionOrString, V>) {
		return new StringTrait(props);
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
	static newCoreStringTrait<V extends string>(props: iStringTraitProps<CoreStringTraitName, V>) {
		return new StringTrait(props);
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

	static newAttributeTraitCollection(
		props: iTraitCollectionFactoryMethodProps,
		...initial: iAttributeData[]
	): iAttributeTraitCollection {
		const {} = props || {};
		return new TraitCollection<AttributeName, number, iAttributeData, iAttribute>(
			{
				...props,
				name: `Attributes`,
				instanceCreator: TraitFactory.newAttributeTrait,
			},
			...initial
		);
	}

	static newSkillTraitCollection(
		props: iTraitCollectionFactoryMethodProps,
		...initial: iSkillData[]
	): iSkillTraitCollection {
		const {} = props || {};
		return new TraitCollection<SkillName, number, iSkillData, iSkill>(
			{
				...props,
				name: `Skills`,
				instanceCreator: TraitFactory.newSkillTrait,
			},
			...initial
		);
	}

	static newDisciplineTraitCollection(
		props: iTraitCollectionFactoryMethodProps,
		...initial: iDisciplineData[]
	): iDisciplineTraitCollection {
		const {} = props || {};
		return new TraitCollection<DisciplineName, number, iDisciplineData, iDiscipline>(
			{
				...props,
				name: `Disciplines`,
				instanceCreator: TraitFactory.newDisciplineTrait,
			},
			...initial
		);
	}

	static newTouchstonesAndConvictionTraitCollection(
		props: iTraitCollectionFactoryMethodProps,
		...initial: iTouchStoneOrConvictionData[]
	): iTouchStoneOrConvictionCollection {
		const {} = props || {};
		return new TraitCollection<string, string, iTouchStoneOrConvictionData, iTouchStoneOrConviction>(
			{
				...props,
				name: `TouchstonesAndConvictions`,
				instanceCreator: TraitFactory.newTouchStoneOrConvictionTrait,
			},
			...initial
		);
	}
}

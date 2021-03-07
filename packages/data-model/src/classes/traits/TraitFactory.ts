import {
	iDisciplineTraitCollection,
	iSkillTraitCollection,
	iTouchStoneOrConvictionCollection,
} from './../../declarations/interfaces/trait-collection-interfaces';
import { iHasDataStorageFactory } from './../../declarations/interfaces/general-interfaces';
import {
	AttributeName,
	AttributeCategory,
	DisciplineName,
	SkillName,
	TraitNameUnionOrString,
	CoreNumberTraitName,
	CoreStringTraitName,
	ClanName,
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
	iTraitData,
} from './../../declarations/interfaces/trait-interfaces';
import NumberTraitWithCategory from './NumberTraitWithCategory';
import NumberTrait from './NumberTrait';
import StringTrait from './StringTrait';
import getAttributeCategory from '../../utils/getAttributeCategory';
import TraitCollection from './TraitCollection';
import { iCharacterSheetData } from '../../declarations/interfaces/character-sheet-interfaces';
import { iAttributeTraitCollection } from '../../declarations/interfaces/trait-collection-interfaces';

export default abstract class TraitFactory {
	// methods use base trait props as all other details should be selected to match the required trait type
	static newStringTrait<V extends string>({
		name,
		value,
		traitDataStorageInitialiser,
	}: iStringTraitProps<TraitNameUnionOrString, V>) {
		return new StringTrait({ name, value, traitDataStorageInitialiser });
	}
	static newNumberTrait({
		name,
		value = 0,
		traitDataStorageInitialiser,
		max,
		min = 0,
	}: iNumberTraitProps<TraitNameUnionOrString>) {
		return new NumberTrait({ name, value, traitDataStorageInitialiser, max, min });
	}
	static newCoreStringTrait<V extends string>({
		name,
		value,

		traitDataStorageInitialiser,
	}: iStringTraitProps<CoreStringTraitName, V>) {
		return new StringTrait({ name, value, traitDataStorageInitialiser });
	}
	static newCoreNumberTrait({
		name,
		value = 0,
		traitDataStorageInitialiser,
		max,
		min = 0,
	}: iNumberTraitProps<CoreNumberTraitName>) {
		return new NumberTrait({ name, value, traitDataStorageInitialiser, max, min });
	}
	static newAttributeTrait({
		name,
		value = 0,

		traitDataStorageInitialiser,
	}: iBaseTraitProps<AttributeName, number, iAttributeData>): iAttribute {
		const props: iNumberTraitWithCategoryProps<AttributeName, AttributeCategory> = {
			categorySelector: getAttributeCategory,
			min: 1,
			max: 5,
			name,
			value,
			traitDataStorageInitialiser,
		};

		return new NumberTraitWithCategory(props);
	}

	static newDisciplineTrait({
		name,
		value = 0,

		traitDataStorageInitialiser,
	}: iBaseTraitProps<DisciplineName, number, iDisciplineData>): iDiscipline {
		const props: iNumberTraitProps<DisciplineName> = {
			min: 1,
			max: 5,
			name,
			value,

			traitDataStorageInitialiser,
		};

		return new NumberTrait(props);
	}

	static newSkillTrait({
		name,
		value = 0,

		traitDataStorageInitialiser,
	}: iBaseTraitProps<SkillName, number, iSkillData>): iSkill {
		const props: iNumberTraitProps<SkillName> = {
			min: 0,
			max: 5,
			name,
			value,

			traitDataStorageInitialiser,
		};

		return new NumberTrait(props);
	}

	static newTouchStoneOrConvictionTrait({
		name,
		value,
		traitDataStorageInitialiser,
	}: iBaseTraitProps<string, string, iTouchStoneOrConvictionData>): iTouchStoneOrConviction {
		const props: iStringTraitProps<string, string> = {
			name,
			value,

			traitDataStorageInitialiser,
		};

		return new StringTrait(props);
	}

	static newAttributeTraitCollection(
		props: iHasDataStorageFactory,
		...initial: iAttributeData[]
	): iAttributeTraitCollection {
		const { dataStorageFactory } = props || {};
		return new TraitCollection<AttributeName, number, iAttributeData, iAttribute>(
			{
				name: `AttributeTraitCollection`,
				dataStorageFactory,
				instanceCreator: TraitFactory.newAttributeTrait,
			},
			...initial
		);
	}

	static newSkillTraitCollection(props: iHasDataStorageFactory, ...initial: iSkillData[]): iSkillTraitCollection {
		const { dataStorageFactory } = props || {};
		return new TraitCollection<SkillName, number, iSkillData, iSkill>(
			{
				name: `SkillTraitCollection`,

				dataStorageFactory,
				instanceCreator: TraitFactory.newSkillTrait,
			},
			...initial
		);
	}

	static newDisciplineTraitCollection(
		props: iHasDataStorageFactory,
		...initial: iDisciplineData[]
	): iDisciplineTraitCollection {
		const { dataStorageFactory } = props || {};
		return new TraitCollection<DisciplineName, number, iDisciplineData, iDiscipline>(
			{
				name: `DisciplineTraitCollection`,
				dataStorageFactory,
				instanceCreator: TraitFactory.newDisciplineTrait,
			},
			...initial
		);
	}

	static newTouchstonesAndConvictionTraitCollection(
		props: iHasDataStorageFactory,
		...initial: iTouchStoneOrConvictionData[]
	): iTouchStoneOrConvictionCollection {
		const { dataStorageFactory } = props || {};
		return new TraitCollection<string, string, iTouchStoneOrConvictionData, iTouchStoneOrConviction>(
			{
				name: `TouchstonesAndConvictionTraitCollection`,
				dataStorageFactory,
				instanceCreator: TraitFactory.newTouchStoneOrConvictionTrait,
			},
			...initial
		);
	}
 

}

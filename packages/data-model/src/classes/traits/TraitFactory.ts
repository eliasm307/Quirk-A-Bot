import { AttributeName, AttributeCategory, DisciplineName, SkillName } from './../../declarations/types';
import {
	iNumberTraitWithCategoryProps,
	iTraitData,
	iHasCategorySelector,
	iAttribute,
	iDiscipline,
	iAttributeData,
	iNumberTraitProps,
	iDisciplineData,
	iSkill,
	iSkillData,
	iStringTraitProps,
	iTouchStoneOrConvictionData,
	iTouchStoneOrConviction,
	iNumberTraitData,
} from './../../declarations/interfaces/trait-interfaces';
import { iCanHaveSaveAction } from '../../declarations/interfaces/general-interfaces';
import NumberTraitWithCategory from './NumberTraitWithCategory';
import NumberTrait from './NumberTrait';
import StringTrait from './StringTrait';
import getAttributeCategory from '../../utils/getAttributeCategory';

interface iGetAttributeProps extends iNumberTraitData<AttributeName>, iCanHaveSaveAction {}
interface iGetDisciplineProps extends iNumberTraitData<DisciplineName>, iCanHaveSaveAction {}
interface iGetSkillProps extends iNumberTraitData<SkillName>, iCanHaveSaveAction {}
interface iGetTouchStoneOrConvictionProps extends iStringTraitProps<string>, iCanHaveSaveAction {}

export default abstract class TraitFactory {
	static newAttributeTrait({ name, value = 0, saveAction }: iGetAttributeProps): iAttribute {
		const props: iNumberTraitWithCategoryProps<AttributeName, AttributeCategory> = {
			categorySelector: getAttributeCategory,
			min: 1,
			max: 5,
			name,
			value,
			saveAction,
		};

		return new NumberTraitWithCategory(props);
	}

	static newDisciplineTrait({ name, value = 0, saveAction }: iGetDisciplineProps): iDiscipline {
		const props: iNumberTraitProps<DisciplineName> = {
			min: 1,
			max: 5,
			name,
			value,
			saveAction,
		};

		return new NumberTrait(props);
	}

	static newSkillTrait({ name, value = 0, saveAction }: iGetSkillProps): iSkill {
		const props: iNumberTraitProps<SkillName> = {
			min: 0,
			max: 5,
			name,
			value,
			saveAction,
		};

		return new NumberTrait(props);
	}

	static newTouchStoneOrConvictionTrait({
		name,
		value = 'TBC...',
		saveAction,
	}: iGetTouchStoneOrConvictionProps): iTouchStoneOrConviction {
		const props: iStringTraitProps<string> = {
			name,
			value,
			saveAction,
		};

		return new StringTrait(props);
	}
}

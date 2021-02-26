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
} from './../../declarations/interfaces/trait-interfaces';
import { iCanHaveSaveAction } from '../../declarations/interfaces/general-interfaces';
import NumberTraitWithCategory from './NumberTraitWithCategory';
import NumberTrait from './NumberTrait';
import StringTrait from './StringTrait';

interface iGetAttributeProps
	extends iAttributeData,
		iCanHaveSaveAction,
		iHasCategorySelector<AttributeName, AttributeCategory> {}
interface iGetDisciplineProps extends iDisciplineData, iCanHaveSaveAction {}
interface iGetSkillProps extends iSkillData, iCanHaveSaveAction {}
interface iGetTouchStoneOrConvictionProps extends iTouchStoneOrConvictionData, iCanHaveSaveAction {}

export default abstract class TraitFactory {
	static newAttributeTrait({ name, value = 0, saveAction, categorySelector }: iGetAttributeProps): iAttribute {
		const props: iNumberTraitWithCategoryProps<AttributeName, AttributeCategory> = {
			categorySelector,
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

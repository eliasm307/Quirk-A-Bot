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
} from './../../declarations/interfaces/trait-interfaces';
import { iCanHaveSaveAction } from '../../declarations/interfaces/general-interfaces';
import NumberTraitWithCategory from './NumberTraitWithCategory';
import NumberTrait from './NumberTrait';

interface iGetAttributeProps
	extends iAttributeData,
		iCanHaveSaveAction,
		iHasCategorySelector<AttributeName, AttributeCategory> {}

interface iGetDisciplineProps extends iDisciplineData, iCanHaveSaveAction {}
interface iGetSkillProps extends iSkillData, iCanHaveSaveAction {}

export default abstract class TraitFactory {
	static getAttributeTrait({ name, value, saveAction, categorySelector }: iGetAttributeProps): iAttribute {
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

	static getDisciplineTrait({ name, value, saveAction }: iGetDisciplineProps): iDiscipline {
		const props: iNumberTraitProps<DisciplineName> = {
			min: 1,
			max: 5,
			name,
			value,
			saveAction,
		};

		return new NumberTrait(props);
	}

	static getSkillTrait({ name, value, saveAction }: iGetSkillProps): iSkill {
		const props: iNumberTraitProps<SkillName> = {
			min: 0,
			max: 5,
			name,
			value,
			saveAction,
		};

		return new NumberTrait(props);
	}
}

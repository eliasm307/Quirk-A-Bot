import { AttributeName, AttributeCategory, DisciplineName } from './../../declarations/types';
import {
	iNumberTraitWithCategoryProps,
	iTraitData,
	iHasCategorySelector,
	iAttribute,
	iDiscipline,
	iAttributeData,
	iNumberTraitProps,
  iDisciplineData,
} from './../../declarations/interfaces/trait-interfaces';
import { iCanHaveSaveAction } from '../../declarations/interfaces/general-interfaces';
import NumberTraitWithCategory from './NumberTraitWithCategory';
import NumberTrait from './NumberTrait';

interface iGetAttributeProps
	extends iAttributeData,
		iCanHaveSaveAction,
		iHasCategorySelector<AttributeName, AttributeCategory> {}

interface iGetDisciplineProps extends iDisciplineData, iCanHaveSaveAction {}

export default abstract class TraitFactory {
	static getAttributeTrait({ name, value, saveAction, categorySelector }: iGetAttributeProps): iAttribute {
		const props: iNumberTraitWithCategoryProps<AttributeName, AttributeCategory> = {
			categorySelector,
			max: 5,
			min: 1,
			name,
			value,
			saveAction,
		};

		return new NumberTraitWithCategory(props);
	}

	static getDisciplineTrait({ name, value, saveAction }: iGetDisciplineProps): iDiscipline {
		const props: iNumberTraitProps<DisciplineName> = {
			max: 5,
			min: 1,
			name,
			value,
			saveAction,
		};

		return new NumberTrait(props);
	}
}

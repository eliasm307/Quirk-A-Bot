import { AttributeName, AttributeCategory } from './../../declarations/types';
import {
	iNumberTraitWithCategoryProps,
	iTraitData,
	iHasCategorySelector,
	iAttribute,
} from './../../declarations/interfaces/trait-interfaces';
import { iSaveAction } from '../../declarations/interfaces/general-interfaces';
import NumberTraitWithCategory from './NumberTraitWithCategory';

interface iGetAttributeProps extends iSaveAction, iTraitData, iHasCategorySelector<AttributeName, AttributeCategory> {
	name: AttributeName;
	value: number;
}

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
  
	static getDisciplineTrait({ name, value, saveAction, categorySelector }: iGetAttributeProps): iDiscipline {
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
}

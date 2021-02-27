import { iCanHaveSaveAction } from './../../declarations/interfaces/general-interfaces';
import {
	AttributeName,
	AttributeCategory,
	DisciplineName,
	SkillName,
	TraitNameUnionOrString,
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
} from './../../declarations/interfaces/trait-interfaces';
import NumberTraitWithCategory from './NumberTraitWithCategory';
import NumberTrait from './NumberTrait';
import StringTrait from './StringTrait';
import getAttributeCategory from '../../utils/getAttributeCategory';
import TraitCollection from './TraitCollection';

export default abstract class TraitFactory {
	// methods use base trait props as all other details should be selected to match the required trait type
	static newStringTrait({ name, value = '', saveAction }: iStringTraitProps<TraitNameUnionOrString>) {
		return new StringTrait({ name, value, saveAction });
	}
	static newNumberTrait({ name, value = 0, saveAction, max, min = 0 }: iNumberTraitProps<TraitNameUnionOrString>) {
		return new NumberTrait({ name, value, saveAction, max, min });
	}
	static newAttributeTrait({ name, value = 0, saveAction }: iBaseTraitProps<AttributeName, number>): iAttribute {
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

	static newDisciplineTrait({ name, value = 0, saveAction }: iBaseTraitProps<DisciplineName, number>): iDiscipline {
		const props: iNumberTraitProps<DisciplineName> = {
			min: 1,
			max: 5,
			name,
			value,
			saveAction,
		};

		return new NumberTrait(props);
	}

	static newSkillTrait({ name, value = 0, saveAction }: iBaseTraitProps<SkillName, number>): iSkill {
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
		value,
		saveAction,
	}: iBaseTraitProps<string, string>): iTouchStoneOrConviction {
		const props: iStringTraitProps<string> = {
			name,
			value,
			saveAction,
		};

		return new StringTrait(props);
	}

	static newAttributeTraitCollection(
		{ saveAction }: iCanHaveSaveAction,
		...initial: iAttributeData[]
	): TraitCollection<iAttribute> {
		return new TraitCollection<iAttribute>(
			{
				saveAction,
				instanceCreator: TraitFactory.newAttributeTrait,
			},
			...initial
		);
	}
}

import { iCanHaveSaveAction } from './../../declarations/interfaces/general-interfaces';
import {
	AttributeName,
	AttributeCategory,
	DisciplineName,
	SkillName,
	TraitNameUnionOrString,
	CoreTraitName,
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
import { iCharacterSheetData } from '../../declarations/interfaces/character-sheet-interfaces';
import TypeFactory from '../TypeFactory';

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

	static newCharacterSheetDataObject(props?: iCanHaveSaveAction): iCharacterSheetData {
		const saveAction = props?.saveAction;
		return {
			bloodPotency: new NumberTrait<CoreTraitName>({ max: 10, name: 'Blood Potency', value: 0, saveAction }),
			clan: new StringTrait<CoreTraitName>({ name: 'Clan', value: '', saveAction }),
			discordUserId: -1,
			health: new NumberTrait<CoreTraitName>({ max: 10, name: 'Health', value: 0, saveAction }),
			humanity: new NumberTrait<CoreTraitName>({ max: 10, name: 'Humanity', value: 0, saveAction }),
			hunger: new NumberTrait<CoreTraitName>({ max: 5, name: 'Hunger', value: 0, saveAction }),
			name: new StringTrait<CoreTraitName>({ name: 'Name', value: '', saveAction }),
			sire: new StringTrait<CoreTraitName>({ name: 'Sire', value: '', saveAction }),
			willpower: new NumberTrait<CoreTraitName>({ name: 'Willpower', value: 0, max: 10, saveAction }),
			attributes: [],
			disciplines: [],
			skills: [],
			touchstonesAndConvictions: [],
		};
	}
}

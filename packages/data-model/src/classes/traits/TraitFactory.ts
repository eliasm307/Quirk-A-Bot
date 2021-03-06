import {
	iDisciplineTraitCollection,
	iSkillTraitCollection,
	iTouchStoneOrConvictionCollection,
} from './../../declarations/interfaces/trait-collection-interfaces';
import { iCanHaveSaveAction } from './../../declarations/interfaces/general-interfaces';
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
	static newStringTrait<V extends string>({ name, value, saveAction }: iStringTraitProps<TraitNameUnionOrString, V>) {
		return new StringTrait({ name, value, saveAction });
	}
	static newNumberTrait({ name, value = 0, saveAction, max, min = 0 }: iNumberTraitProps<TraitNameUnionOrString>) {
		return new NumberTrait({ name, value, saveAction, max, min });
	}
	static newCoreStringTrait<V extends string>({ name, value, saveAction }: iStringTraitProps<CoreStringTraitName, V>) {
		return new StringTrait({ name, value, saveAction });
	}
	static newCoreNumberTrait({ name, value = 0, saveAction, max, min = 0 }: iNumberTraitProps<CoreNumberTraitName>) {
		return new NumberTrait({ name, value, saveAction, max, min });
	}
	static newAttributeTrait({
		name,
		value = 0,
		saveAction,
	}: iBaseTraitProps<AttributeName, number, iAttributeData>): iAttribute {
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

	static newDisciplineTrait({
		name,
		value = 0,
		saveAction,
	}: iBaseTraitProps<DisciplineName, number, iDisciplineData>): iDiscipline {
		const props: iNumberTraitProps<DisciplineName> = {
			min: 1,
			max: 5,
			name,
			value,
			saveAction,
		};

		return new NumberTrait(props);
	}

	static newSkillTrait({ name, value = 0, saveAction }: iBaseTraitProps<SkillName, number, iSkillData>): iSkill {
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
	}: iBaseTraitProps<string, string, iTouchStoneOrConvictionData>): iTouchStoneOrConviction {
		const props: iStringTraitProps<string, string> = {
			name,
			value,
			saveAction,
		};

		return new StringTrait(props);
	}

	static newAttributeTraitCollection(
		props?: iCanHaveSaveAction,
		...initial: iAttributeData[]
	): iAttributeTraitCollection {
		const { saveAction } = props || {};
		return new TraitCollection<AttributeName, number, iAttributeData, iAttribute>(
			{
				name: `AttributeTraitCollection`,
				saveAction,
				instanceCreator: TraitFactory.newAttributeTrait,
			},
			...initial
		);
	}

	static newSkillTraitCollection(props?: iCanHaveSaveAction, ...initial: iSkillData[]): iSkillTraitCollection {
		const { saveAction } = props || {};
		return new TraitCollection<SkillName, number, iSkillData, iSkill>(
			{
				name: `SkillTraitCollection`,
				saveAction,
				instanceCreator: TraitFactory.newSkillTrait,
			},
			...initial
		);
	}

	static newDisciplineTraitCollection(
		props?: iCanHaveSaveAction,
		...initial: iDisciplineData[]
	): iDisciplineTraitCollection {
		const { saveAction } = props || {};
		return new TraitCollection<DisciplineName, number, iDisciplineData, iDiscipline>(
			{
				name: `DisciplineTraitCollection`,
				saveAction,
				instanceCreator: TraitFactory.newDisciplineTrait,
			},
			...initial
		);
	}

	static newTouchstonesAndConvictionTraitCollection(
		props?: iCanHaveSaveAction,
		...initial: iTouchStoneOrConvictionData[]
	): iTouchStoneOrConvictionCollection {
		const { saveAction } = props || {};
		return new TraitCollection<string, string, iTouchStoneOrConvictionData, iTouchStoneOrConviction>(
			{
				name: `TouchstonesAndConvictionTraitCollection`,
				saveAction,
				instanceCreator: TraitFactory.newTouchStoneOrConvictionTrait,
			},
			...initial
		);
	}

 
	static newCharacterSheetDataObject(props?: iCanHaveSaveAction): iCharacterSheetData {
		const saveAction = props?.saveAction;
		return {
			discordUserId: NaN,
			bloodPotency: TraitFactory.newCoreNumberTrait({
				max: 10,
				name: 'Blood Potency',
				value: 0,
				saveAction,
			}),
			health: TraitFactory.newCoreNumberTrait({ max: 10, name: 'Health', value: 0, saveAction }),
			humanity: TraitFactory.newCoreNumberTrait({ max: 10, name: 'Humanity', value: 0, saveAction }),
			hunger: TraitFactory.newCoreNumberTrait({ max: 5, name: 'Hunger', value: 0, saveAction }),
			willpower: TraitFactory.newCoreNumberTrait({ name: 'Willpower', value: 0, max: 10, saveAction }),
			name: TraitFactory.newCoreStringTrait<string>({ name: 'Name', value: '', saveAction }),
			sire: TraitFactory.newCoreStringTrait<string>({ name: 'Sire', value: '', saveAction }),
			clan: TraitFactory.newCoreStringTrait<ClanName>({ name: 'Clan', value: '', saveAction }),
			attributes: [],
			disciplines: [],
			skills: [],
			touchstonesAndConvictions: [],
		};
	}
}

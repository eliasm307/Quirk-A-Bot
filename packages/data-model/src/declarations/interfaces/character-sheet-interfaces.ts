import TraitCollection from '../../classes/traits/TraitCollection';
import {
	iTouchStoneOrConvictionData,
	iAttributeData,
	iSkillData,
	iDisciplineData,
	iAttribute,
	iDiscipline,
	iTouchStoneOrConviction,
	iSkill,
	iStringTrait,
	iNumberTrait,
	iTraitData,
} from './trait-interfaces';
import { ClanName, CoreNumberTraitName, CoreStringTraitName,  } from '../types';
import { iToJson } from './general-interfaces';

// todo delete
export interface iCharacterSheetPrimitiveData {
	discordUserId: number;
	// todo add user aliases (ie known discord names to be added by bot)
	name: string;
	clan: ClanName;
	sire: string;
	health: number; // todo limit 0 to 10
	willpower: number; // todo limit 0 to 10
	hunger: number; // todo limit 0 to 5
	humanity: number; // todo limit 0 to 10
	bloodPotency: number; // todo limit 0 to 10
	
	
}
export interface iCharacterSheetNonPrimitiveData {}

export interface iCharacterSheetData extends iCharacterSheetNonPrimitiveData {
	discordUserId: number;
	name: iTraitData<CoreStringTraitName, string>;
	clan: iTraitData<CoreStringTraitName, string>;
	sire: iTraitData<CoreStringTraitName, string>;
	health: iTraitData<CoreNumberTraitName, number>;
	willpower: iTraitData<CoreNumberTraitName, number>;
	hunger: iTraitData<CoreNumberTraitName, number>;
	humanity: iTraitData<CoreNumberTraitName, number>;
	bloodPotency: iTraitData<CoreNumberTraitName, number>;
	attributes: iAttributeData[];
	skills: iSkillData[];
	disciplines: iDisciplineData[];
	touchstonesAndConvictions: iTouchStoneOrConvictionData[];
}

export interface iCharacterSheet extends iToJson<iCharacterSheetData> {
	// saveToFile(): boolean; // ? should this be handled by another class?
	// toJson(): iCharacterSheetData;

	readonly discordUserId: number;
	// todo add user aliases (ie known discord names to be added by bot)
	name: iStringTrait<string>;
	clan: iStringTrait<string>;
	sire: iStringTrait<string>;
	health: iNumberTrait<string>;
	willpower: iNumberTrait<string>;
	hunger: iNumberTrait<string>;
	humanity: iNumberTrait<string>;
	bloodPotency: iNumberTrait<string>;
	skills: TraitCollection<iSkill>;
	attributes: TraitCollection<iAttribute>;
	disciplines: TraitCollection<iDiscipline>;
	touchstonesAndConvictions: TraitCollection<iTouchStoneOrConviction>;
}

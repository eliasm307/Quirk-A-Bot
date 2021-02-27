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
} from './trait-interfaces';
import { ClanName } from '../types';
import { iToJson } from './general-interfaces';

interface iCharacterSheetPrimitiveData {
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
interface iCharacterSheetNonPrimitiveData {
	touchstonesAndConvictions: iTouchStoneOrConvictionData[];
	attributes: iAttributeData[];
	skills: iSkillData[];
	disciplines: iDisciplineData[];
}

export interface iCharacterSheetData extends iCharacterSheetPrimitiveData, iCharacterSheetNonPrimitiveData {}

export interface iCharacterSheet extends iToJson<iCharacterSheetData> {
	// saveToFile(): boolean; // ? should this be handled by another class?
	// toJson(): iCharacterSheetData;

	readonly discordUserId: number;
	// todo add user aliases (ie known discord names to be added by bot)
	name: iStringTrait<string>;
	clan: iStringTrait<string>;
	sire: iStringTrait<string>;
	health: iNumberTrait<string>; // todo limit 0 to 10
	willpower: iNumberTrait<string>; // todo limit 0 to 10
	hunger: iNumberTrait<string>; // todo limit 0 to 5
	humanity: iNumberTrait<string>; // todo limit 0 to 10
	bloodPotency: iNumberTrait<string>; // todo limit 0 to 10

	skills: TraitCollection<iSkill>;
	attributes: TraitCollection<iAttribute>;
	disciplines: TraitCollection<iDiscipline>;
	touchstonesAndConvictions: TraitCollection<iTouchStoneOrConviction>;
}

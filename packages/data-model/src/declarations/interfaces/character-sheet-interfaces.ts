import { iLoggerCollection } from './log-interfaces';
import {
	iAttributeTraitCollection,
	iDisciplineTraitCollection,
	iSkillTraitCollection,
	iTouchStoneOrConvictionCollection,
} from './trait-collection-interfaces';
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
	iCoreNumberTrait,
	iCoreStringTrait,
} from './trait-interfaces';
import { ClanName, CoreNumberTraitName, CoreStringTraitName } from '../types';
import { iToJson } from './general-interfaces';

// todo rename to ibaseCharacterSheet and then CS data and CS object should extend this, only discord userId is common between them for now
export interface iCharacterSheetNonPrimitiveData {}

export interface iCharacterSheetData extends iCharacterSheetNonPrimitiveData {
	// todo add user aliases (ie known discord names to be added by bot)
	discordUserId: number;
	name: iTraitData<CoreStringTraitName, string>;
	clan: iTraitData<CoreStringTraitName, ClanName>;
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

export interface iCharacterSheet extends iToJson<iCharacterSheetData>, iLoggerCollection {
	// saveToFile(): boolean; // ? should this be handled by another class?

	readonly discordUserId: number;
	// todo add user aliases (ie known discord names to be added by bot)
	name: iCoreStringTrait;
	clan: iCoreStringTrait;
	sire: iCoreStringTrait;
	health: iCoreNumberTrait;
	willpower: iCoreNumberTrait;
	hunger: iCoreNumberTrait;
	humanity: iCoreNumberTrait;
	bloodPotency: iCoreNumberTrait;
	skills: iSkillTraitCollection;
	attributes: iAttributeTraitCollection;
	disciplines: iDisciplineTraitCollection;
	touchstonesAndConvictions: iTouchStoneOrConvictionCollection;
}

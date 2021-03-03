import { iLoggerCollection } from './log-interfaces';
import {
	iAttributeTraitCollection,
	iDisciplineTraitCollection,
	iSkillTraitCollection,
	iTouchStoneOrConvictionCollection,
} from './trait-collection-interfaces';
import {
	iTouchStoneOrConvictionData,
	iAttributeData,
	iSkillData,
	iDisciplineData,
	iTraitData,
	iCoreNumberTrait,
	iCoreStringTrait,
} from './trait-interfaces';
import { ClanName, CoreNumberTraitName, CoreStringTraitName } from '../types';
import { iToJson } from './general-interfaces';

/** The basic shape of a charactersheet */
export interface iBaseCharacterSheet {
	readonly discordUserId: number;
	// todo add user aliases (ie known discord names to be added by bot)
	name: any;
	clan: any;
	sire: any;
	health: any;
	willpower: any;
	hunger: any;
	humanity: any;
	bloodPotency: any;
	skills: any;
	attributes: any;
	disciplines: any;
	touchstonesAndConvictions: any;
}

/** The shape of character sheet as plain JSON data */
export interface iCharacterSheetData extends iBaseCharacterSheet {
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

/** The shape of a character sheet object instance */
export interface iCharacterSheet extends iBaseCharacterSheet, iToJson<iCharacterSheetData>, iLoggerCollection {
	// saveToFile(): boolean; // ? should this be handled by another class?

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

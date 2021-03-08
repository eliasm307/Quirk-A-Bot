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
	iNumberTraitData,
	iCoreNumberTraitData,
	iCoreStringTraitData,
} from './trait-interfaces';
import { ClanName, CoreNumberTraitName, CoreStringTraitName } from '../types';
import { iToJson } from './general-interfaces';
import { iDataStorageFactory } from './data-storage-interfaces';

export interface iCharacterSheetProps {
	id: string;
	dataStorageFactory: iDataStorageFactory;
}

/** The basic shape of a charactersheet */
export interface iBaseCharacterSheet {
	readonly id: string;
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
	name: iCoreStringTraitData<string>;
	clan: iCoreStringTraitData<ClanName>;
	sire: iCoreStringTraitData<string>;
	health: iCoreNumberTraitData;
	willpower: iCoreNumberTraitData;
	hunger: iCoreNumberTraitData;
	humanity: iCoreNumberTraitData;
	bloodPotency: iCoreNumberTraitData;
	attributes: iAttributeData[];
	skills: iSkillData[];
	disciplines: iDisciplineData[];
	touchstonesAndConvictions: iTouchStoneOrConvictionData[];
}

/** The shape of a character sheet object instance */
export interface iCharacterSheet extends iBaseCharacterSheet, iToJson<iCharacterSheetData>, iLoggerCollection {
	#dataStorageFactory: iDataStorageFactory;
	name: iCoreStringTrait<string>;
	clan: iCoreStringTrait<ClanName>; // todo allow this to specify using ClanName type union
	sire: iCoreStringTrait<string>;
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

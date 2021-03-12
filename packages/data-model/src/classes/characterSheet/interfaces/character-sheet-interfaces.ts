import { iHasParentPath, iHasToJson } from '../../../declarations/interfaces';
import { ClanName } from '../../../declarations/types';
import {
	iHasId,
	iHasDataStorageFactory,
	iHasCharacterSheetDataStorage,
} from '../../data-storage/interfaces/data-storage-interfaces';
import { iHasCharacterSheetLogReporter } from '../../log/interfaces/log-interfaces';
import {
	iAttributeTraitCollection,
	iDisciplineTraitCollection,
	iSkillTraitCollection,
	iTouchStoneOrConvictionCollection,
} from '../../traits/interfaces/trait-collection-interfaces';
import {
	iAttributeData,
	iCoreNumberTraitData,
	iCoreStringTraitData,
	iDisciplineData,
	iSkillData,
	iTouchStoneOrConvictionData,
	iCoreNumberTrait,
	iCoreStringTrait,
} from '../../traits/interfaces/trait-interfaces';

export interface iHasCharacterSheet {
	characterSheet: iCharacterSheet;
}
export interface iHasCharacterSheetData {
	characterSheetData: iCharacterSheetData;
}

export interface iCharacterSheetLoaderProps extends iHasId, iHasDataStorageFactory, iHasParentPath {}

export interface iCharacterSheetProps
	extends iCharacterSheetLoaderProps,
		iHasParentPath,
		iHasCharacterSheetDataStorage {}

/** The basic shape of a charactersheet */
export interface iBaseCharacterSheet {
	readonly id: string;

	attributes: any;
	bloodPotency: any;
	clan: any;
	disciplines: any;
	health: any;
	humanity: any;
	hunger: any;
	// todo add user aliases (ie known discord names to be added by bot)
	name: any;
	sire: any;
	skills: any;
	touchstonesAndConvictions: any;
	willpower: any;
}

/** The shape of character sheet as plain JSON data */
export interface iCharacterSheetData extends iBaseCharacterSheet {
	attributes: iAttributeData[];
	bloodPotency: iCoreNumberTraitData;
	// ? should this be just a string?
	clan: iCoreStringTraitData<ClanName>;
	disciplines: iDisciplineData[];
	// ? should this be just a string?
	health: iCoreNumberTraitData;
	humanity: iCoreNumberTraitData;
	hunger: iCoreNumberTraitData;
	name: iCoreStringTraitData<string>;
	sire: iCoreStringTraitData<string>;
	skills: iSkillData[];
	touchstonesAndConvictions: iTouchStoneOrConvictionData[];
	willpower: iCoreNumberTraitData;
}

/** The shape of a character sheet object instance */
export interface iCharacterSheet
	extends iBaseCharacterSheet,
		iHasToJson<iCharacterSheetData>,
		iHasCharacterSheetLogReporter {
	attributes: iAttributeTraitCollection;
	bloodPotency: iCoreNumberTrait;
	// ? should this be just a string?
	clan: iCoreStringTrait<ClanName>;
	disciplines: iDisciplineTraitCollection;
	// ? should this be just a string?
	health: iCoreNumberTrait;
	humanity: iCoreNumberTrait;
	hunger: iCoreNumberTrait;
	name: iCoreStringTrait<string>;
	path: string;
	// todo allow this to specify using ClanName type union
	sire: iCoreStringTrait<string>;
	skills: iSkillTraitCollection;
	touchstonesAndConvictions: iTouchStoneOrConvictionCollection;
	willpower: iCoreNumberTrait;
}

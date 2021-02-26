import Attribute from "../../classes/traits/Attribute";
import Discipline from "../../classes/traits/Discipline";
import Skill from "../../classes/traits/Skill";
import TouchStoneOrConviction from "../../classes/traits/TouchStoneOrConviction";
import TraitCollection from "../../classes/traits/TraitCollection";
import { iTouchStoneOrConvictionData, iAttributeData, iSkillData, iDisciplineData } from "../interfaces";
import { ClanName } from "../types";
import { iToJson } from "./general-interfaces";

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

export interface iCharacterSheet extends iCharacterSheetPrimitiveData, iToJson<iCharacterSheetData> {
	// saveToFile(): boolean; // ? should this be handled by another class?
	// toJson(): iCharacterSheetData;

	skills: TraitCollection<Skill>;
	attributes: TraitCollection<Attribute>;
	disciplines: TraitCollection<Discipline>;
	touchstonesAndConvictions: TraitCollection<TouchStoneOrConviction>;
}
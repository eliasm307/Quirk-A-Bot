import {
	AttributeMap,
	SkillMap,
	DisciplineMap,
	AttributeName,
	DisciplineName,
	SkillName,
} from './../declarations/types';
import { iAttribute, iCharacterSheet, iCharacterSheetModel, iDiscipline, iSkill } from '../declarations/interfaces';
import TypeFactory from './TypeFactory';
export default class CharacterSheet implements iCharacterSheet {
	readonly discordUserId: number;

	//-------------------------------------
	// properties with custom setters
	private _health: number;
	private _willpower: number;
	private _hunger: number;
	private _humanity: number;
	private _bloodPotency: number;
	private _name: string;
	private _clan: string;
	private _sire: string;
	private _attributes: AttributeMap;
	private _skills: SkillMap;
	private _disciplines: DisciplineMap;
	private _touchstonesAndConvictions: string[];

	//-------------------------------------
	// BASIC VARIABLE GETTERS AND SETTERS
	public set health(newVal: number) {
		this._health = newVal;
	}
	public set willpower(newVal: number) {}
	public set hunger(newVal: number) {}
	public set humanity(newVal: number) {}
	public set bloodPotency(newVal: number) {}
	public set name(newVal: string) {}
	public set clan(newVal: string) {}
	public set sire(newVal: string) {}

	//-------------------------------------
	// ATTRIBUTES
	public get attributes(): iAttribute[] {
		return Array.from(this._attributes.values());
	}

	public getAttributeByName(name: string): iAttribute | null {
		return this._attributes.has(name) ? (this._attributes.get(name) as iAttribute) : null;
	}

	//-------------------------------------
	// SKILLS
	public get skills(): iSkill[] {
		return Array.from(this._skills.values());
	}

	//-------------------------------------
	// DISCIPLINES
	public get disciplines(): iDiscipline[] {
		return Array.from(this._disciplines.values());
	}

	//-------------------------------------
	// TOUCHSTONES AND CONVICTIONS
	public get touchstonesAndConvictions(): string[] {
		return [...this._touchstonesAndConvictions];
	}

	//-------------------------------------
	// CONSTRUCTOR
	constructor(sheet: iCharacterSheet | number) {
		if (typeof sheet === 'number') {
			this.discordUserId = sheet;

			// initialise with default values
			this._health = 0;
			this._willpower = 0;
			this._hunger = 0;
			this._humanity = 0;
			this._bloodPotency = 0;
			this._name = '';
			this._clan = '';
			this._sire = '';
			this._attributes = TypeFactory.newAttributeMap();
			this._disciplines = TypeFactory.newDisciplineMap();
			this._skills = TypeFactory.newSkillMap();
			this._touchstonesAndConvictions = [];
		} else if (typeof sheet === 'object') {
			const {
				attributes,
				bloodPotency,
				clan,
				disciplines,
				health,
				humanity,
				hunger,
				name,
				sire,
				skills,
				touchstonesAndConvictions,
				willpower,
				discordUserId,
			} = sheet;

			// initialise using input details
			this.discordUserId = discordUserId;
			this._health = health;
			this._willpower = willpower;
			this._hunger = hunger;
			this._humanity = humanity;
			this._bloodPotency = bloodPotency;
			this._name = name;
			this._clan = clan;
			this._sire = sire;

			this._attributes = new Map<AttributeName, iAttribute>(attributes.map(e => [e.name, e]));
			this._disciplines = new Map<DisciplineName, iDiscipline>(disciplines.map(e => [e.name, e]));
			this._skills = new Map<SkillName, iSkill>(skills.map(e => [e.name, e]));
			this._touchstonesAndConvictions = [...touchstonesAndConvictions];
		} else {
			throw `${__filename} constructor argument not defined`;
		}
	}


}

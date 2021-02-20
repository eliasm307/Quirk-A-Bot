import path from 'path';
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
import importDataFromFile from '../utils/importDataFromFile';
import exportDataToFile from '../utils/exportDataToFile';

interface iLoadFromFileArgs {
	filePath?: string;
	fileName?: string;
}

// todo split this into smaller pieces

export default class CharacterSheet implements iCharacterSheet {
	readonly discordUserId: number;
	private savePath: string;

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
	// todo add auto save for each change, maybe on change handler that takes in an iChangeEvent object
	public set health(newVal: number) {
		this._health = newVal;
	}
	public get health() {
		return this._health;
	}
	public set willpower(newVal: number) {
		this._willpower = newVal;
	}
	public get willpower() {
		return this._willpower;
	}
	public set hunger(newVal: number) {
		this._hunger = newVal;
	}
	public get hunger() {
		return this._hunger;
	}
	public set humanity(newVal: number) {
		this._humanity = newVal;
	}
	public get humanity() {
		return this._humanity;
	}
	public set bloodPotency(newVal: number) {
		this._bloodPotency = newVal;
	}
	public get bloodPotency() {
		return this._bloodPotency;
	}
	public set name(newVal: string) {
		this._name = newVal;
	}
	public get name() {
		return this._name;
	}
	public set clan(newVal: string) {
		this._clan = newVal;
	}
	public get clan() {
		return this._clan;
	}
	public set sire(newVal: string) {
		this._sire = newVal;
	}
	public get sire() {
		return this._sire;
	}

	//-------------------------------------
	// ATTRIBUTES
	public get attributes(): iAttribute[] {
		return Array.from(this._attributes.values());
	}

	public getAttributeByName(name: string): iAttribute | null {
		return this._attributes.has(name) ? (this._attributes.get(name) as iAttribute) : null;
	}

	// todo item adder method

	//-------------------------------------
	// SKILLS
	public get skills(): iSkill[] {
		return Array.from(this._skills.values());
	}

	// todo single getter method
	// todo item adder method
	//-------------------------------------
	// DISCIPLINES
	public get disciplines(): iDiscipline[] {
		return Array.from(this._disciplines.values());
	}

	// todo single getter method
	// todo item adder method
	//-------------------------------------
	// TOUCHSTONES AND CONVICTIONS
	public get touchstonesAndConvictions(): string[] {
		return [...this._touchstonesAndConvictions];
	}

	// todo single getter method
	// todo item adder method

	//-------------------------------------
	// CONSTRUCTOR
	constructor(sheet: iCharacterSheet | number, customSavePath?: string) {
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

			// initial save
			this.saveToFile(customSavePath);
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
		this.savePath = customSavePath || path.resolve(__dirname, `../data/character-sheets/${this.discordUserId}.json`);
	}

	public static loadFromFile({ filePath, fileName }: iLoadFromFileArgs): iCharacterSheet {
		if (!filePath && !fileName) throw `${__filename}: filePath and fileName are not defined, cannot load from file`;

		const resolvedPath =
			filePath ||
			path.resolve(__dirname, `../data/character-sheets/${fileName}${/\.json$/i.test(fileName || '') ? `` : `.json`}`);

		const data: iCharacterSheet = importDataFromFile(resolvedPath);

		return new CharacterSheet(data);
	}

	private saveToFile(): boolean {
		// create data to save to file
		const saveData: iCharacterSheet = {
			attributes: this.attributes,
			bloodPotency: this.bloodPotency,
			clan: this.clan,
			disciplines: this.disciplines,
			discordUserId: this.discordUserId,
			health: this.health,
			humanity: this.humanity,
			hunger: this.hunger,
			name: this.name,
			sire: this.sire,
			skills: this.skills,
			touchstonesAndConvictions: this.touchstonesAndConvictions,
			willpower: this.willpower,
		};

		return exportDataToFile(saveData, this.savePath);
	}
}

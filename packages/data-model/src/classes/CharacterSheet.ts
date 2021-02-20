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

	//-------------------------------------
	// private properties with custom setters and/or getters
	#savePath: string; // specified in constructor
	#health: number;
	#willpower: number;
	#hunger: number;
	#humanity: number;
	#bloodPotency: number;
	#name: string;
	#clan: string;
	#sire: string;
	#attributes: AttributeMap;
	#skills: SkillMap;
	#disciplines: DisciplineMap;
	#touchstonesAndConvictions: string[];

	//-------------------------------------
	// BASIC VARIABLE GETTERS AND SETTERS
	// todo add auto save for each change, maybe on change handler that takes in an iChangeEvent object
	public set health(newVal: number) {
		this.#health = newVal;
		this.onChange('attributes', this.#health, newVal);
	}
	public get health() {
		return this.#health;
	}
	public set willpower(newVal: number) {
		this.#willpower = newVal;
	}
	public get willpower() {
		return this.#willpower;
	}
	public set hunger(newVal: number) {
		this.#hunger = newVal;
	}
	public get hunger() {
		return this.#hunger;
	}
	public set humanity(newVal: number) {
		this.#humanity = newVal;
	}
	public get humanity() {
		return this.#humanity;
	}
	public set bloodPotency(newVal: number) {
		this.#bloodPotency = newVal;
	}
	public get bloodPotency() {
		return this.#bloodPotency;
	}
	public set name(newVal: string) {
		this.#name = newVal;
	}
	public get name() {
		return this.#name;
	}
	public set clan(newVal: string) {
		this.#clan = newVal;
	}
	public get clan() {
		return this.#clan;
	}
	public set sire(newVal: string) {
		this.#sire = newVal;
	}
	public get sire() {
		return this.#sire;
	}

	//-------------------------------------
	// ATTRIBUTES
	public get attributes(): iAttribute[] {
		return Array.from(this.#attributes.values());
	}

	public getAttributeByName(name: string): iAttribute | null {
		return this.#attributes.has(name) ? (this.#attributes.get(name) as iAttribute) : null;
	}

	// todo item adder method

	//-------------------------------------
	// SKILLS
	public get skills(): iSkill[] {
		return Array.from(this.#skills.values());
	}

	// todo single getter method
	// todo item adder method
	//-------------------------------------
	// DISCIPLINES
	public get disciplines(): iDiscipline[] {
		return Array.from(this.#disciplines.values());
	}

	// todo single getter method
	// todo item adder method
	//-------------------------------------
	// TOUCHSTONES AND CONVICTIONS
	public get touchstonesAndConvictions(): string[] {
		return [...this.#touchstonesAndConvictions];
	}

	// todo single getter method
	// todo item adder method

	//-------------------------------------
	// CONSTRUCTOR
	constructor(sheet: iCharacterSheet | number, customSavePath?: string) {
		if (typeof sheet === 'number') {
			this.discordUserId = sheet;

			// initialise with default values
			this.#health = 0;
			this.#willpower = 0;
			this.#hunger = 0;
			this.#humanity = 0;
			this.#bloodPotency = 0;
			this.#name = '';
			this.#clan = '';
			this.#sire = '';
			this.#attributes = TypeFactory.newAttributeMap();
			this.#disciplines = TypeFactory.newDisciplineMap();
			this.#skills = TypeFactory.newSkillMap();
			this.#touchstonesAndConvictions = [];
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
			this.#health = health;
			this.#willpower = willpower;
			this.#hunger = hunger;
			this.#humanity = humanity;
			this.#bloodPotency = bloodPotency;
			this.#name = name;
			this.#clan = clan;
			this.#sire = sire;

			this.#attributes = new Map<AttributeName, iAttribute>(attributes.map(e => [e.name, e]));
			this.#disciplines = new Map<DisciplineName, iDiscipline>(disciplines.map(e => [e.name, e]));
			this.#skills = new Map<SkillName, iSkill>(skills.map(e => [e.name, e]));
			this.#touchstonesAndConvictions = [...touchstonesAndConvictions];
		} else {
			throw `${__filename} constructor argument not defined`;
		}

		this.#savePath = customSavePath || path.resolve(__dirname, `../data/character-sheets/${this.discordUserId}.json`);

		// if only user id was provided, assume this is a new sheet then do initial save so a persistent file exists
		if (typeof sheet === 'number') this.saveToFile();
	}

	public static loadFromFile({ filePath, fileName }: iLoadFromFileArgs): iCharacterSheet {
		if (!filePath && !fileName) throw `${__filename}: filePath and fileName are not defined, cannot load from file`;

		const resolvedPath =
			filePath ||
			path.resolve(__dirname, `../data/character-sheets/${fileName}${/\.json$/i.test(fileName || '') ? `` : `.json`}`);

		const data: iCharacterSheet = importDataFromFile(resolvedPath);

		// load the character sheet and set the current location as the save path
		return new CharacterSheet(data, resolvedPath);
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

		return exportDataToFile(saveData, this.#savePath);
	}
	private onChange<Key extends keyof iCharacterSheet, T>(property: Key, oldValue: T, newValue: T): void {}
}

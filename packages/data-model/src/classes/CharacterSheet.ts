import {
	iCharacterSheetData,
	iLogEvent,
	iLogger,
	iTouchStoneOrConviction,
	iLogCollection,
} from './../declarations/interfaces';
import path from 'path';
import { iAttribute, iCharacterSheet, iDiscipline, iSkill } from '../declarations/interfaces';
import importDataFromFile from '../utils/importDataFromFile';
import exportDataToFile from '../utils/exportDataToFile';
import Attribute from './traits/Attribute';
import Skill from './traits/Skill';
import TraitCollection from './TraitCollection';
import Discipline from './traits/Discipline';
import TouchStoneOrConviction from './traits/TouchStoneOrConviction';
import { LogOperation } from '../declarations/types';
import LogCollection from './log/LogCollection';
import BaseLogEvent from './log/BaseLogEvent';
import UpdateLogEvent from './log/UpdateLogEvent';

interface iLoadFromFileArgs {
	filePath?: string;
	fileName?: string;
}

interface iModifiablePrimitiveProperties {
	health: number;
	willpower: number;
	hunger: number;
	humanity: number;
	bloodPotency: number;
	name: string;
	clan: string;
	sire: string;
}

const example: iModifiablePrimitiveProperties = {
	bloodPotency: 0,
	clan: '',
	health: 0,
	humanity: 0,
	hunger: 0,
	name: '',
	sire: '',
	willpower: 0,
};

// todo split this into smaller pieces

// data types of fields that will be logged
type LogDataType = typeof example[keyof iModifiablePrimitiveProperties];

export default class CharacterSheet implements iCharacterSheet, iLogger<LogDataType> {
	readonly discordUserId: number;

	//-------------------------------------
	// private properties with custom setters and/or getters

	/** Existing instances of this class */
	static instances: Map<string, iCharacterSheet> = new Map<string, iCharacterSheet>();
	#savePath: string; // specified in constructor
	#private: iModifiablePrimitiveProperties;

	//-------------------------------------
	// BASIC VARIABLE GETTERS AND SETTERS
	public set health(newVal: number) {
		this.onChange('health', newVal);
	}
	public get health() {
		return this.#private.health;
	}
	public set willpower(newVal: number) {
		this.onChange('willpower', newVal);
	}
	public get willpower() {
		return this.#private.willpower;
	}
	public set hunger(newVal: number) {
		this.onChange('hunger', newVal);
	}
	public get hunger() {
		return this.#private.hunger;
	}
	public set humanity(newVal: number) {
		this.onChange('humanity', newVal);
	}
	public get humanity() {
		return this.#private.humanity;
	}
	public set bloodPotency(newVal: number) {
		this.onChange('bloodPotency', newVal);
	}
	public get bloodPotency() {
		return this.#private.bloodPotency;
	}
	public set name(newVal: string) {
		this.onChange('name', newVal);
	}
	public get name() {
		return this.#private.name;
	}
	public set clan(newVal: string) {
		this.onChange('clan', newVal);
	}
	public get clan() {
		return this.#private.clan;
	}
	public set sire(newVal: string) {
		this.onChange('sire', newVal);
	}
	public get sire() {
		return this.#private.sire;
	}
	//-------------------------------------
	// NON BASIC VARIABLE COLLECTIONS
	readonly attributes: TraitCollection<iAttribute>;
	readonly skills: TraitCollection<iSkill>;
	readonly disciplines: TraitCollection<iDiscipline>;
	readonly touchstonesAndConvictions: TraitCollection<iTouchStoneOrConviction>;

	//-------------------------------------
	// CONSTRUCTOR
	constructor(sheet: iCharacterSheetData | number, customSavePath?: string) {
		let initialAttributes: iAttribute[] = [];
		let initialDisciplines: iDiscipline[] = [];
		let initialSkills: iSkill[] = [];
		let initialTouchstonesAndConvictions: iTouchStoneOrConviction[] = [];

		if (typeof sheet === 'number') {
			this.discordUserId = sheet;

			// initialise with default values
			this.#private = {
				health: 0,
				willpower: 0,
				hunger: 0,
				humanity: 0,
				bloodPotency: 0,
				name: '',
				clan: '',
				sire: '',
			};

			this.touchstonesAndConvictions = new TraitCollection({
				characterSheet: this,
				instanceCreator: (name, value) => new TouchStoneOrConviction(this.saveToFile, name, value),
			});
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
			this.#private = {
				health: health,
				willpower: willpower,
				hunger: hunger,
				humanity: humanity,
				bloodPotency: bloodPotency,
				name: name,
				clan: clan,
				sire: sire,
			};

			initialAttributes = [...attributes];
			initialDisciplines = [...disciplines];
			initialSkills = [...skills];
			initialTouchstonesAndConvictions = [...touchstonesAndConvictions];
		} else {
			throw Error(`${__filename} constructor argument not defined`);
		}

		const saveAction = this.saveToFile;

		// create collections, with initial data where available
		this.attributes = new TraitCollection<iAttribute>(
			{
				characterSheet: this,
				instanceCreator: ( name, value ) => new Attribute( { saveAction, name, value }),
			},
			...initialAttributes
		);

		this.skills = new TraitCollection<iSkill>(
			{
				characterSheet: this,
				instanceCreator: (name, value) => new Skill({ saveAction, name, value }),
			},
			...initialSkills
		);

		this.disciplines = new TraitCollection<iDiscipline>(
			{
				characterSheet: this,
				instanceCreator: (name, value) => new Discipline({ saveAction, name, value }),
			},
			...initialDisciplines
		);

		this.touchstonesAndConvictions = new TraitCollection<iTouchStoneOrConviction>(
			{
				characterSheet: this,
				instanceCreator: (name, value) => new TouchStoneOrConviction({ saveAction, name, value }),
			},
			...initialTouchstonesAndConvictions
		);

		// try using resolved custom path, otherwise create path in general location using the user id
		this.#savePath =
			(customSavePath ? path.resolve(customSavePath) : '') ||
			path.resolve(__dirname, `../data/character-sheets/${this.discordUserId}.json`);

		// if only user id was provided, assume this is a new sheet then do initial save so a persistent file exists
		if (typeof sheet === 'number') this.saveToFile();
	}

	// todo loading and saving should be done by a persistence management class
	/**
	 * Static method to create an instance from an existing character sheet JSON file
	 */
	public static loadFromFile({ filePath, fileName }: iLoadFromFileArgs): CharacterSheet {
		if (!filePath && !fileName)
			throw Error(`${__filename}: filePath and fileName are not defined, cannot load from file`);

		// try using the input filePath resolved, otherwise create path using filename in general location
		const resolvedPath =
			(filePath ? path.resolve(filePath) : '') ||
			path.resolve(__dirname, `../data/character-sheets/${fileName}${/\.json$/i.test(fileName || '') ? `` : `.json`}`);

		// check if an instance exists
		if (CharacterSheet.instances.has(resolvedPath)) {
			// console.log(__filename, `Using existing instance for '${resolvedPath}'`);
			return CharacterSheet.instances.get(resolvedPath) as CharacterSheet;
		}
		// console.log(__filename, `No existing instance for '${resolvedPath}', loading new instance`);

		// todo add option to create blank instance at the specified path if it doesnt exist?
		// todo make sure imported data matches expected schema
		const data: iCharacterSheetData = importDataFromFile(resolvedPath);

		const instance = new CharacterSheet(data, resolvedPath);

		// save instance reference
		CharacterSheet.instances.set(resolvedPath, instance);

		// load the character sheet and set the current location as the save path
		return instance;
	}

	public toJson(): iCharacterSheetData {
		return {
			attributes: this.attributes.toJson(),
			bloodPotency: this.bloodPotency,
			clan: this.clan,
			disciplines: this.disciplines.toJson(),
			discordUserId: this.discordUserId,
			health: this.health,
			humanity: this.humanity,
			hunger: this.hunger,
			name: this.name,
			sire: this.sire,
			skills: this.skills.toJson(),
			touchstonesAndConvictions: this.touchstonesAndConvictions.toJson(),
			willpower: this.willpower,
		};
	}

	private saveToFile(): boolean {
		return exportDataToFile(this.toJson(), this.#savePath);
	}

	// todo can this not use an any type
	private onChange<T extends LogDataType, PrivateProperty extends keyof iModifiablePrimitiveProperties>(
		property: PrivateProperty,
		newValue: any
	): void {
		// get current value as old value
		const oldValue: LogDataType = this.#private[property];

		// if old value is the same as new value do nothing
		if (oldValue === newValue)
			return console.log(__filename, `Property ${property} was changed to the same value, nothing was done.`);

		// implement property change
		this.#private[property] = newValue;

		// todo record change, create a log class where this has an array of logs
		this.#logEvents.log(new UpdateLogEvent({ oldValue, newValue, property }));

		// attempt autosave
		this.saveToFile()
			? null /*console.log(__filename, `Successfully saved change`, { property, oldValue, newValue })*/
			: console.error(__filename, `Error while saving change`, { property, oldValue, newValue });
	}

	#logEvents: iLogCollection<LogDataType> = new LogCollection();

	getLogData(): iLogEvent<LogDataType>[] {
		return [...this.#logEvents.toJson()];
	}
}

import {
	iAttribute,
	iDiscipline,
	iNumberTrait,
	iSkill,
	iStringTrait,
	iTouchStoneOrConviction,
	iTouchStoneOrConvictionData,
} from '../declarations/interfaces/trait-interfaces';
import path from 'path';
import { iAttributeData, iDisciplineData, iSkillData } from '../declarations/interfaces/trait-interfaces';
import TraitCollection from './traits/TraitCollection';
import importDataFromFile from '../utils/importDataFromFile';
import LogCollection from './log/LogCollection';
import UpdateLogEvent from './log/UpdateLogEvent';
import exportDataToFile from '../utils/exportDataToFile';
import { iCharacterSheet, iCharacterSheetData } from '../declarations/interfaces/character-sheet-interfaces';
import { iLogger, iLogCollection, iLogEvent } from '../declarations/interfaces/log-interfaces';
import TraitFactory from './traits/TraitFactory';
import TypeFactory from './TypeFactory';

interface iLoadFromFileArgs {
	filePath?: string;
	fileName?: string;
}

// todo make each of these into a new type of trait object, so methods can be implemented like "Describe" etc
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

export default class CharacterSheet implements iCharacterSheet, iLogger {
	readonly discordUserId: number;

	//-------------------------------------
	// private properties with custom setters and/or getters

	/** Existing instances of this class */
	static instances: Map<string, iCharacterSheet> = new Map<string, iCharacterSheet>();

	#private: iModifiablePrimitiveProperties;
	#logEvents: iLogCollection = new LogCollection();
	#savePath: string; // specified in constructor

	//-------------------------------------
	// NON BASIC VARIABLE COLLECTIONS
	readonly attributes: TraitCollection<iAttribute>;
	readonly skills: TraitCollection<iSkill>;
	readonly disciplines: TraitCollection<iDiscipline>;
	readonly touchstonesAndConvictions: TraitCollection<iTouchStoneOrConviction>;
	readonly name: iStringTrait<string>;
	readonly clan: iStringTrait<string>;
	readonly sire: iStringTrait<string>;
	readonly health: iNumberTrait<string>; // todo limit 0 to 10
	readonly willpower: iNumberTrait<string>; // todo limit 0 to 10
	readonly hunger: iNumberTrait<string>; // todo limit 0 to 5
	readonly humanity: iNumberTrait<string>; // todo limit 0 to 10
	readonly bloodPotency: iNumberTrait<string>; // todo limit 0 to 10

	//-------------------------------------
	// CONSTRUCTOR
	constructor(sheet: iCharacterSheetData | number, customSavePath?: string) {
		let initialAttributes: iAttributeData[] = [];
		let initialDisciplines: iDisciplineData[] = [];
		let initialSkills: iSkillData[] = [];
		let initialTouchstonesAndConvictions: iTouchStoneOrConvictionData[] = [];

		// initialise with default values
		let characterTraitInitialValues: iCharacterSheetData = {
			discordUserId: -1,
			health: 0,
			willpower: 0,
			hunger: 0,
			humanity: 0,
			bloodPotency: 0,
			name: '',
			clan: '',
			sire: '',
			attributes: [],
			disciplines: [],
			skills: [],
			touchstonesAndConvictions: [],
		};

		if (typeof sheet === 'number') {
			this.discordUserId = sheet;
			characterTraitInitialValues.discordUserId = this.discordUserId;
		} else if (typeof sheet === 'object') {
			/*const {
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
			} = sheet;*/

			// initialise using input details
			this.discordUserId = sheet.discordUserId;
			characterTraitInitialValues = sheet;
/*
			initialAttributes = [...attributes];
			initialDisciplines = [...disciplines];
			initialSkills = [...skills];
			initialTouchstonesAndConvictions = [...touchstonesAndConvictions];*/
		} else {
			throw Error(`${__filename} constructor argument not defined`);
		}

		// function to save this character sheet 
		const saveAction = () => this.saveToFile();

		this.bloodPotency = TraitFactory.newNumberTrait({max: 10, name: ''})

		// create collections, with initial data where available
		this.attributes = new TraitCollection<iAttribute>(
			{
				saveAction,
				instanceCreator: TraitFactory.newAttributeTrait,
			},
			...initialAttributes
		);

		this.skills = new TraitCollection<iSkill>(
			{
				saveAction,
				instanceCreator: TraitFactory.newSkillTrait,
			},
			...initialSkills
		);

		this.disciplines = new TraitCollection<iDiscipline>(
			{
				saveAction,
				instanceCreator: TraitFactory.newDisciplineTrait,
			},
			...initialDisciplines
		);

		this.touchstonesAndConvictions = new TraitCollection<iTouchStoneOrConviction>(
			{
				saveAction,
				instanceCreator: TraitFactory.newTouchStoneOrConvictionTrait,
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
		const data = importDataFromFile<iCharacterSheetData>(resolvedPath);

		if (!data) throw Error(`Error importing data from ${resolvedPath}`);

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
		// this.#savePath
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

	getLogData(): iLogEvent[] {
		return [...this.#logEvents.toJson()];
	}
}

import { iCharacterSheetData, iTouchStoneOrConviction } from './../declarations/interfaces';
import path from 'path';
import { DisciplineMap, AttributeName, DisciplineName, SkillName, TraitName, TraitMap } from './../declarations/types';
import { iAttribute, iCharacterSheet, iDiscipline, iSkill } from '../declarations/interfaces';
import TypeFactory from './TypeFactory';
import importDataFromFile from '../utils/importDataFromFile';
import exportDataToFile from '../utils/exportDataToFile';
import Attribute from './Attribute';
import Skill from './Skill';
import TraitCollection from './TraitCollection';
import Discipline from './Discipline';
import TouchStoneOrConviction from './TouchStoneOrConviction';

interface iLoadFromFileArgs {
	filePath?: string;
	fileName?: string;
}

interface iPrivateModifiableProperties {
	health: number;
	willpower: number;
	hunger: number;
	humanity: number;
	bloodPotency: number;
	name: string;
	clan: string;
	sire: string;
	attributes: TraitMap<iAttribute>;
	skills: TraitMap<iSkill>;
	disciplines: TraitMap<iDiscipline>;
	touchstonesAndConvictions: TraitMap<iTouchStoneOrConviction>;
}

// todo split this into smaller pieces

export default class CharacterSheet implements iCharacterSheet {
	readonly discordUserId: number;

	//-------------------------------------
	// private properties with custom setters and/or getters
	static instances: Map<string, iCharacterSheet> = new Map<string, iCharacterSheet>();
	#savePath: string; // specified in constructor
	#private: iPrivateModifiableProperties;

	//-------------------------------------
	// BASIC VARIABLE GETTERS AND SETTERS
	// todo generate setters and getters dynamically, as they follow the same pattern
	// todo add auto save for each change, maybe on change handler that takes in an iChangeEvent object
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

	readonly attributes: TraitCollection<iAttribute> = new TraitCollection(
		this,
		(name, value) => new Attribute(this, name, value)
	);
	readonly skills: TraitCollection<iSkill> = new TraitCollection(this, (name, value) => new Skill(this, name, value));

	readonly disciplines: TraitCollection<iDiscipline> = new TraitCollection(
		this,
		(name, value) => new Discipline(this, name, value)
	);

	readonly touchstonesAndConvictions: TraitCollection<iTouchStoneOrConviction> = new TraitCollection(
		this,
		(name, value) => new TouchStoneOrConviction(this, name, value)
	);
	//-------------------------------------
	// TOUCHSTONES AND CONVICTIONS
	// todo make this log changes
	/*public get touchstonesAndConvictions(): string[] {
		return [...this.#private.touchstonesAndConvictions];
	}*/

	// todo single getter method
	// todo item adder method
	// todo add remove method

	//-------------------------------------
	// CONSTRUCTOR
	constructor(sheet: iCharacterSheetData | number, customSavePath?: string) {
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
				attributes: TypeFactory.newTraitMap(),
				disciplines: TypeFactory.newTraitMap(),
				skills: TypeFactory.newTraitMap(),
				touchstonesAndConvictions: TypeFactory.newTraitMap(),
			};
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

				attributes: TypeFactory.newTraitMap<iAttribute>(...attributes),
				disciplines: TypeFactory.newTraitMap<iDiscipline>(...disciplines),
				skills: TypeFactory.newTraitMap<iSkill>(...skills),
				touchstonesAndConvictions: TypeFactory.newTraitMap<iTouchStoneOrConviction>(...touchstonesAndConvictions),
			};
		} else {
			throw `${__filename} constructor argument not defined`;
		}

		// try using resolved custom path, otherwise create path in general location using the user id
		this.#savePath =
			(customSavePath ? path.resolve(customSavePath) : '') ||
			path.resolve(__dirname, `../data/character-sheets/${this.discordUserId}.json`);

		// if only user id was provided, assume this is a new sheet then do initial save so a persistent file exists
		if (typeof sheet === 'number') this.saveToFile();
	}

	/**
	 * Static method to create an instance from an existing character sheet JSON file
	 */
	public static loadFromFile({ filePath, fileName }: iLoadFromFileArgs): CharacterSheet {
		if (!filePath && !fileName) throw `${__filename}: filePath and fileName are not defined, cannot load from file`;

		// try using the input filePath resolved, otherwise create path using filename in general location
		const resolvedPath =
			(filePath ? path.resolve(filePath) : '') ||
			path.resolve(__dirname, `../data/character-sheets/${fileName}${/\.json$/i.test(fileName || '') ? `` : `.json`}`);

		// check if an instance exists
		if (CharacterSheet.instances.has(resolvedPath)) {
			// console.log(__filename, `Using existing instance for '${resolvedPath}'`);
			return CharacterSheet.instances.get(resolvedPath) as CharacterSheet;
		}
		console.log(__filename, `No existing instance for '${resolvedPath}', loading new instance`);

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

	saveToFile(): boolean {
		return exportDataToFile(this.toJson(), this.#savePath);
	}
	private onChange<PrivateProperty extends keyof iPrivateModifiableProperties>(
		property: PrivateProperty,
		newValue: any
	): void {
		// get current value as old value
		const oldValue: any = this.#private[property];

		// if old value is the same as new value do nothing
		if (oldValue === newValue)
			return console.log(__filename, `Property ${property} was changed to the same value, nothing was done.`);

		// implement property change
		this.#private[property] = newValue;

		// todo record change, create a log class where this has an array of logs

		// attempt autosave
		this.saveToFile()
			? null /*console.log(__filename, `Successfully saved change`, { property, oldValue, newValue })*/
			: console.error(__filename, `Error while saving change`, { property, oldValue, newValue });
	}
}

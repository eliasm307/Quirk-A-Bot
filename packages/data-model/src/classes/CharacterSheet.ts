import { iCharacterSheetData, iTrait as iTrait } from './../declarations/interfaces';
import path from 'path';
import { DisciplineMap, AttributeName, DisciplineName, SkillName, TraitName, TraitMap } from './../declarations/types';
import { iAttribute, iCharacterSheet, iDiscipline, iSkill } from '../declarations/interfaces';
import TypeFactory from './TypeFactory';
import importDataFromFile from '../utils/importDataFromFile';
import exportDataToFile from '../utils/exportDataToFile';
import Attribute from './Attribute';
import Skill from './Skill';
import { isAttributeName, isSkillName } from '../utils/typePredicates';

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
	disciplines: DisciplineMap;
	touchstonesAndConvictions: string[];
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

	//-------------------------------------
	// GENERIC METHODS
	private getGenericTraitByName<N, T>( name: N, map: Map<N, T> ): T | null {
		
		return map.get(name) as T;
	}

	private setGenericTraitValue<N, T extends iTrait>(
		map: TraitMap<T>,
		name: TraitName<T>,
		value: number,
		instanceCreator: () => T,
		typeName: 'Attribute' | 'Skill' | 'Discipline' | string = 'Detail'
	): void {
		// console.warn(__filename, `setting value for ${typeName} with name '${name}' to value '${value}'`);

		// todo find out how to print type name, ie ${ReturnType<typeof instanceCreator>}

		if (name && value) {
			// if detail already exists then just update it
			if (map.has(name)) {
				const instance = map.get(name);

				if (!instance)
					return console.error(__filename, `${typeName} with name '${name}' is not defined but key exists`);

				// todo add on change handler call
				instance.value = value;
			} else {
				// todo add on change handler call for new detail
				// else add new detail instance
				map.set(name, instanceCreator());
			}
		} else {
			console.error(__filename, `set${typeName} error: bad inputs`, { attribute: name, value });
		}
	}

	/*
	// NOTE this could work but its a bit too convoluted for intellisense to work properly so no major benefits
	public setTrait<T extends iTrait>( name: TraitName<T>, value: number ): void {
		// todo make sure this covers all cases
		if (isAttributeName(name)) {
			return this.setGenericTraitValue(
				this.#private.attributes,
				name,
				value,
				() => new Attribute(this, name, value),
				'Attribute'
			);
		} else if ( isSkillName( name ) ) {
			return this.setGenericTraitValue(
				this.#private.skills,
				name,
				value,
				() => new Skill(this, name, value),
				'Skill'
			);
		} else {
			throw `Trait name unkown: ${name}`;
		}
	}
	*/

	// todo add remove detail method

	//-------------------------------------
	// ATTRIBUTES
	public get attributes(): iAttribute[] {
		return Array.from(this.#private.attributes.values());
	}
	public getAttributeByName(name: AttributeName): iAttribute | null {
		return this.getGenericTraitByName(name, this.#private.attributes);
	}

	/**
	 * Update attribute value if it exists, otherwise add the attribute
	 * @param name attribute name
	 * @param value attribute value
	 */
	public setAttribute(name: AttributeName, value: number): void {
		return this.setGenericTraitValue(
			this.#private.attributes,
			name,
			value,
			() => new Attribute(this, name, value),
			'Attribute'
		);
		/*if (typeof name === 'string' && name && typeof value === 'number') {
			// if attribute already exists then just update it
			if (this.#private.attributes.has(name)) {
				const instance = this.#private.attributes.get(name);

				if (!instance) return console.error(__filename, `Attribute with name '${name}' is not defined but key exists`);

				console.log(__filename, `Setting attribute value on `);
				instance.value = value;
			} else {
				// else add new attribute instance
				this.#private.attributes.set(name, new Attribute(this, name, value));
			}
		} else {
			console.error(__filename, 'addAttribute error: bad inputs', { attribute: name, value });
		}*/
	}

	//-------------------------------------
	// SKILLS
	public get skills(): iSkill[] {
		return Array.from(this.#private.skills.values());
	}

	public getSkillByName(name: SkillName): iSkill | null {
		return this.getGenericTraitByName(name, this.#private.skills);
	}

	public setSkill(name: SkillName, value: number): void {
		return this.setGenericTraitValue(this.#private.skills, name, value, () => new Skill(this, name, value), 'skill');
	}

	// todo add remove method

	//-------------------------------------
	// DISCIPLINES
	// todo do this as a map
	public get disciplines(): iDiscipline[] {
		return Array.from(this.#private.disciplines.values());
	}

	// todo single getter method
	// todo item adder method
	// todo add remove method
	//-------------------------------------
	// TOUCHSTONES AND CONVICTIONS
	public get touchstonesAndConvictions(): string[] {
		return [...this.#private.touchstonesAndConvictions];
	}

	// todo single getter method
	// todo item adder method
	// todo add remove method

	//-------------------------------------
	// CONSTRUCTOR
	constructor(sheet: iCharacterSheet | number, customSavePath?: string) {
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
				disciplines: TypeFactory.newDisciplineMap(),
				skills: TypeFactory.newTraitMap(),
				touchstonesAndConvictions: [],
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
				disciplines: new Map<DisciplineName, iDiscipline>(disciplines.map(e => [e.name, e])),
				skills: TypeFactory.newTraitMap<iSkill>(...skills),
				touchstonesAndConvictions: [...touchstonesAndConvictions],
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
		const data: iCharacterSheet = importDataFromFile(resolvedPath);

		const instance = new CharacterSheet(data, resolvedPath);

		// save instance reference
		CharacterSheet.instances.set(resolvedPath, instance);

		// load the character sheet and set the current location as the save path
		return instance;
	}

	public toJson(): iCharacterSheetData {
		return {
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

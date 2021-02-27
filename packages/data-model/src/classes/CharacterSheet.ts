import { CoreNumberTraitName, CoreStringTraitName, TraitValueTypeUnion } from './../declarations/types';
import { iBaseTrait, iNumberTraitData, iStringTraitData } from './../declarations/interfaces/trait-interfaces';
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
import NumberTrait from './traits/NumberTrait';
import StringTrait from './traits/StringTrait';
import { isBaseTrait, isCharacterSheetData } from '../utils/typePredicates';

// ! this shouldnt be here, should be in a file about persistence
interface iLoadFromFileArgs {
	filePath?: string;
	fileName?: string;
}

// todo split this into smaller pieces

export default class CharacterSheet implements iCharacterSheet, iLogger {
	readonly discordUserId: number;

	//-------------------------------------
	// private properties with custom setters and/or getters

	/** Existing instances of this class */
	static instances: Map<string, iCharacterSheet> = new Map<string, iCharacterSheet>();

	// #private: iModifiablePrimitiveProperties;
	// #logEvents: iLogCollection = new LogCollection();
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
		let initialValues: iCharacterSheetData | null = null;

		// function to save this character sheet
		const saveAction = () => this.saveToFile();

		if (typeof sheet === 'number') {
			this.discordUserId = sheet;
			// initialValues.discordUserId = this.discordUserId;
			// initialValues = TraitFactory.newCharacterSheetDataObject( { saveAction });
		} else if (typeof sheet === 'object') {
			if (isCharacterSheetData(sheet)) {
				const { attributes, disciplines, skills, touchstonesAndConvictions } = sheet;

				// initialise using input details
				this.discordUserId = sheet.discordUserId;
				initialValues = sheet;

				initialAttributes = [...attributes];
				initialDisciplines = [...disciplines];
				initialSkills = [...skills];
				initialTouchstonesAndConvictions = [...touchstonesAndConvictions];
			} else {
				console.error(__filename, { sheet });
				throw Error(`${__filename} data is an object but it is not valid character sheet data, "${sheet}"`);
			}
		} else {
			throw Error(`${__filename} constructor argument not defined`);
		}

		// core number traits
		this.bloodPotency = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Blood Potency',
			value: initialValues?.bloodPotency.value || 0,
		});

		this.hunger = new NumberTrait<CoreNumberTraitName>({
			max: 5,
			name: 'Hunger',
			value: initialValues?.hunger.value || 0,
		});

		this.humanity = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Humanity',
			value: initialValues?.humanity.value || 0,
		});

		this.health = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Health',
			value: initialValues?.health.value || 0,
		});

		this.willpower = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Willpower',
			value: initialValues?.willpower.value || 0,
		});

		// core string traits
		this.name = new StringTrait<CoreStringTraitName>({
			name: 'Name',
			value: initialValues?.name.value || '',
			saveAction,
		});

		this.sire = new StringTrait<CoreStringTraitName>({
			name: 'Sire',
			value: initialValues?.sire.value || '',
			saveAction,
		});

		this.clan = new StringTrait<CoreStringTraitName>({
			name: 'Clan',
			value: initialValues?.clan.value || '',
			saveAction,
		});

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
		const data: iCharacterSheetData = {
			attributes: this.attributes.toJson(),
			bloodPotency: this.bloodPotency.toJson() as iNumberTraitData<CoreNumberTraitName>,
			clan: this.clan.toJson() as iStringTraitData<CoreStringTraitName>,
			disciplines: this.disciplines.toJson(),
			discordUserId: this.discordUserId,
			health: this.health.toJson() as iNumberTraitData<CoreNumberTraitName>,
			humanity: this.humanity.toJson() as iNumberTraitData<CoreNumberTraitName>,
			hunger: this.hunger.toJson() as iNumberTraitData<CoreNumberTraitName>,
			name: this.name.toJson() as iStringTraitData<CoreStringTraitName>,
			sire: this.sire.toJson() as iStringTraitData<CoreStringTraitName>,
			skills: this.skills.toJson(),
			touchstonesAndConvictions: this.touchstonesAndConvictions.toJson(),
			willpower: this.willpower.toJson() as iNumberTraitData<CoreNumberTraitName>,
		};
		console.log(__filename, { data });
		return data;
	}

	private saveToFile(): boolean {
		// this.#savePath
		return exportDataToFile(this.toJson(), this.#savePath);
	}

	// todo make this report log events grouped into objects with details about the property
	getLogData(): iLogEvent[] {
		const exampleData = TraitFactory.newCharacterSheetDataObject();
		const ex = this;
		const logs: iLogEvent[] = [];

		// todo put core traits into a private traitCollection then get logs as normal
		/*
		for ( let key: keyof iCharacterSheet  in iCharacterSheetw ) {
 
			const trait  = this.getTraitByName(key)
			if ( isBaseTrait<string, TraitValueTypeUnion>( this[ key ] ) ) {
				logs.push(...this[key].)
			}
			
		}
	/	*/

		throw Error('Method not implemented');

		return [];
	}

	private getTraitByName<T extends keyof iCharacterSheet>(key: T): iBaseTrait<string, TraitValueTypeUnion> | null {
		const trait = this[key];

		if (isBaseTrait(trait)) {
			return trait;
		}
		return null;
	}
}

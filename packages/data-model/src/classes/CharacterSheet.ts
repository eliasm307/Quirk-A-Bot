import { iLogReport } from './../declarations/interfaces/log-interfaces';
import {
	iAttributeTraitCollection,
	iSkillTraitCollection,
	iDisciplineTraitCollection,
	iTouchStoneOrConvictionCollection,
} from './../declarations/interfaces/trait-collection-interfaces';
import {
	CoreNumberTraitName,
	CoreStringTraitName,
	TraitValueTypeUnion,
	TraitNameUnionOrString,
	ClanName,
} from './../declarations/types';
import {
	iBaseTrait,
	iCoreStringTrait,
	iNumberTraitData,
	iStringTraitData,
	iCoreNumberTrait,
	iTraitData,
	iStringTrait,
} from './../declarations/interfaces/trait-interfaces';
import { iTouchStoneOrConvictionData } from '../declarations/interfaces/trait-interfaces';
import path from 'path';
import { iAttributeData, iDisciplineData, iSkillData } from '../declarations/interfaces/trait-interfaces';
import importDataFromFile from '../utils/importDataFromFile';
import exportDataToFile from '../utils/exportDataToFile';
import { iCharacterSheet, iCharacterSheetData } from '../declarations/interfaces/character-sheet-interfaces';
import { iLoggerSingle, iLogEvent } from '../declarations/interfaces/log-interfaces';
import TraitFactory from './traits/TraitFactory';
import StringTrait from './traits/StringTrait';
import { isBaseTrait, isCharacterSheetData } from '../utils/typePredicates';
import NumberTrait from './traits/NumberTrait';

// ! this shouldnt be here, should be in a file about persistence
interface iLoadFromFileArgs {
	filePath?: string;
	fileName?: string;
}

// todo split this into smaller pieces

export default class CharacterSheet implements iCharacterSheet {
	readonly discordUserId: number;

	//-------------------------------------
	// private properties with custom setters and/or getters

	/** Existing instances of this class */
	static instances: Map<string, iCharacterSheet> = new Map<string, iCharacterSheet>();

	// #private: iModifiablePrimitiveProperties;
	// #logEvents: iLogCollection = new LogCollection();
	#savePath: string; // specified in constructor

	//-------------------------------------
	// NON BASIC PRIMITIVE VARIABLES
	readonly attributes: iAttributeTraitCollection;
	readonly skills: iSkillTraitCollection;
	readonly disciplines: iDisciplineTraitCollection;
	readonly touchstonesAndConvictions: iTouchStoneOrConvictionCollection;

	readonly name: iCoreStringTrait<string>;
	readonly clan: iCoreStringTrait<ClanName>;
	readonly sire: iCoreStringTrait<string>;
	readonly health: iCoreNumberTrait;
	readonly willpower: iCoreNumberTrait;
	readonly hunger: iCoreNumberTrait;
	readonly humanity: iCoreNumberTrait;
	readonly bloodPotency: iCoreNumberTrait;

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
		const saveAction = () => this.saveToFile(this.toJson(), this.#savePath);

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
				// console.error(__filename, { sheet });
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
		this.name = new StringTrait<CoreStringTraitName, string>({
			name: 'Name',
			value: initialValues?.name.value || '',
			saveAction,
		});

		this.sire = new StringTrait<CoreStringTraitName, string>({
			name: 'Sire',
			value: initialValues?.sire.value || '',
			saveAction,
		});

		this.clan = new StringTrait<CoreStringTraitName, ClanName>({
			name: 'Clan',
			value: initialValues?.clan.value || '',
			saveAction,
		});

		// create collections, with initial data where available
		this.attributes = TraitFactory.newAttributeTraitCollection({ saveAction }, ...initialAttributes);

		this.skills = TraitFactory.newSkillTraitCollection({ saveAction }, ...initialSkills);

		this.disciplines = TraitFactory.newDisciplineTraitCollection({ saveAction }, ...initialDisciplines);

		this.touchstonesAndConvictions = TraitFactory.newTouchstonesAndConvictionTraitCollection(
			{ saveAction },
			...initialTouchstonesAndConvictions
		);

		// try using resolved custom path, otherwise create path in general location using the user id
		this.#savePath =
			(customSavePath ? path.resolve(customSavePath) : '') ||
			path.resolve(__dirname, `../data/character-sheets/${this.discordUserId}.json`);

		// if only user id was provided, assume this is a new sheet then do initial save so a persistent file exists
		if (typeof sheet === 'number') this.saveToFile(this.toJson(), this.#savePath);
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
		const data = importDataFromFile(resolvedPath);

		if (!data) throw Error(`Error importing data from ${resolvedPath}`);

		if (!isCharacterSheetData(data))
			throw Error(`Data loaded from path "${resolvedPath}" is not valid character sheet data`);

		const instance = new CharacterSheet(data, resolvedPath);

		// save instance reference
		CharacterSheet.instances.set(resolvedPath, instance);

		// load the character sheet and set the current location as the save path
		return instance;
	}

	public toJson(): iCharacterSheetData {
		const data: iCharacterSheetData = {
			discordUserId: this.discordUserId,

			// trait collections
			attributes: this.attributes.toJson(),
			disciplines: this.disciplines.toJson(),
			skills: this.skills.toJson(),
			touchstonesAndConvictions: this.touchstonesAndConvictions.toJson(),

			// core string traits
			clan: this.clan.toJson(),
			name: this.name.toJson(),
			sire: this.sire.toJson(),

			// core number traits
			health: this.health.toJson(),
			humanity: this.humanity.toJson(),
			hunger: this.hunger.toJson(),
			bloodPotency: this.bloodPotency.toJson(),
			willpower: this.willpower.toJson(),
		};
		// console.log(__filename, { data });
		return data;
	}

	private saveToFile(data: iCharacterSheetData, savePath: string): boolean {
		// this.#savePath
		return exportDataToFile(data, savePath);
	}

	private getAllTraits(): iBaseTrait<
		TraitNameUnionOrString,
		TraitValueTypeUnion,
		iTraitData<TraitNameUnionOrString, TraitValueTypeUnion>
	>[] {
		// todo make this automatic and dynamic
		return [
			...this.attributes.toArray(),
			...this.disciplines.toArray(),
			...this.skills.toArray(),
			...this.touchstonesAndConvictions.toArray(),
			this.bloodPotency,
			this.clan,
			this.health,
			this.humanity,
			this.hunger,
			this.name,
			this.sire,
			this.willpower,
		];
	}

	getLogReport(): iLogReport[] {
		// todo test
		return this.getAllTraits().map(trait => trait.getLogReport());
	}
	getLogEvents(): iLogEvent[] {
		// todo test
		// combine logs from reports and and sort oldest to newest
		return this.getLogReport()
			.reduce((events, report) => [...events, ...report.logEvents], [] as iLogEvent[])
			.sort((a, b) => {
				return Number(a.timeStamp - b.timeStamp);
			});
	}
}

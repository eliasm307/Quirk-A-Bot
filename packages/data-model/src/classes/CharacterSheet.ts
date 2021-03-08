import {
	iDataStorageFactory,
	iHasId,
	iCharacterSheetDataStorage,
} from './../declarations/interfaces/data-storage-interfaces';
import { iCharacterSheet } from './../declarations/interfaces/character-sheet-interfaces';
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
	iCoreNumberTrait,
	iTraitData,
} from './../declarations/interfaces/trait-interfaces';
import { iTouchStoneOrConvictionData } from '../declarations/interfaces/trait-interfaces';
import path from 'path';
import { iAttributeData, iDisciplineData, iSkillData } from '../declarations/interfaces/trait-interfaces';
import { iCharacterSheetData, iCharacterSheetProps } from '../declarations/interfaces/character-sheet-interfaces';
import { iLogEvent } from '../declarations/interfaces/log-interfaces';
import TraitFactory from './traits/TraitFactory';
import StringTrait from './traits/StringTrait';
import { isCharacterSheetData } from '../utils/typePredicates';
import NumberTrait from './traits/NumberTrait';
// import saveCharacterSheetToFile from '../utils/saveCharacterSheetToFile';

// ! this shouldnt be here, should be in a file about persistence
interface iLoadFromFileArgs {
	filePath?: string;
	fileName?: string;
}

// todo split this into smaller pieces

export default class CharacterSheet implements iCharacterSheet {
	readonly id: string;

	//-------------------------------------
	// private properties with custom setters and/or getters

	/** Existing instances of this class */
	protected static instances: Map<string, CharacterSheet> = new Map<string, CharacterSheet>();

	// #private: iModifiablePrimitiveProperties;
	// #logEvents: iLogCollection = new LogCollection();
	// #savePath: string; // specified in constructor
	#dataStorageFactory: iDataStorageFactory;

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

	// SINGLETON CONSTRUCTOR
	static load(props: iCharacterSheetProps): CharacterSheet {
		const { dataStorageFactory, id } = props;
		const preExistingInstance = CharacterSheet.instances.get(id);

		// if an instance has already been created with this id then use that instance
		if (preExistingInstance) return preExistingInstance;

		// check if a character sheet with this id doesnt exist in the data storage, initialise a blank character sheet if not
		const characterSheetDataStorage = dataStorageFactory.newCharacterSheetDataStorage({ id });
		if (!characterSheetDataStorage.exists()) characterSheetDataStorage.initialise(); // todo make this an internal class method named 'assert' or something

		// return a new character sheet instance as requested
		// Note a character sheet instance only creates an object that is connected to a character sheet on the data source, it doesnt initialise a new character sheet on the data source
		return new CharacterSheet(props);
	}

	//-------------------------------------
	// CONSTRUCTOR
	private constructor({ id, dataStorageFactory }: iCharacterSheetProps) {
		this.#dataStorageFactory = dataStorageFactory;

		const characterSheetDataStorage = dataStorageFactory.newCharacterSheetDataStorage({ id });

		const initialData = characterSheetDataStorage.getData();
		if (!isCharacterSheetData(initialData))
			throw Error(`${__filename} data is an object but it is not valid character sheet data, "${initialData}"`);

		const traitDataStorageInitialiser = dataStorageFactory.newTraitDataStorageInitialiser({
			characterSheet: this,
		});

		const traitCollectionDataStorageInitialiser = dataStorageFactory.newTraitCollectionDataStorageInitialiser({
			characterSheet: this,
		});

		// todo instantiate factory here and pass id in which is used to instantiate a CharacterSheetDataStorage object which then provides the character sheet data to initialise everything else
		/*
		let initialAttributes: iAttributeData[] = [];
		let initialDisciplines: iDisciplineData[] = [];
		let initialSkills: iSkillData[] = [];
		let initialTouchstonesAndConvictions: iTouchStoneOrConvictionData[] = [];

		// initialise with default values
		let initialValues: iCharacterSheetData | null = null;
 */

		/*
		{
			const { attributes, disciplines, skills, touchstonesAndConvictions } = initialData;

			// initialise using input details
			this.discordUserId = initialData.discordUserId;
			initialValues = initialData;
			initialAttributes = [...attributes];
			initialDisciplines = [...disciplines];
			initialSkills = [...skills];
			initialTouchstonesAndConvictions = [...touchstonesAndConvictions];
		} else {
			// console.error(__filename, { sheet });
			throw Error(`${__filename} data is an object but it is not valid character sheet data, "${initialData}"`);
		}*/

		this.id = id;

		// core number traits
		this.bloodPotency = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Blood Potency',
			value: initialData.bloodPotency.value || 0,
			traitDataStorageInitialiser,
		});

		this.hunger = new NumberTrait<CoreNumberTraitName>({
			max: 5,
			name: 'Hunger',
			value: initialData.hunger.value || 0,
			traitDataStorageInitialiser,
		});

		this.humanity = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Humanity',
			value: initialData.humanity.value || 0,
			traitDataStorageInitialiser,
		});

		this.health = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Health',
			value: initialData.health.value || 0,
			traitDataStorageInitialiser,
		});

		this.willpower = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Willpower',
			value: initialData.willpower.value || 0,
			traitDataStorageInitialiser,
		});

		// core string traits
		this.name = new StringTrait<CoreStringTraitName, string>({
			name: 'Name',
			value: initialData.name.value || 'TBC',
			traitDataStorageInitialiser,
		});

		this.sire = new StringTrait<CoreStringTraitName, string>({
			name: 'Sire',
			value: initialData.sire.value || 'TBC',
			traitDataStorageInitialiser,
		});

		this.clan = new StringTrait<CoreStringTraitName, ClanName>({
			name: 'Clan',
			value: initialData.clan.value || 'TBC',
			traitDataStorageInitialiser,
		});

		// create collections, with initial data where available
		this.attributes = TraitFactory.newAttributeTraitCollection(
			{ traitCollectionDataStorageInitialiser, traitDataStorageInitialiser },
			...initialData.attributes
		);

		this.skills = TraitFactory.newSkillTraitCollection(
			{ traitCollectionDataStorageInitialiser, traitDataStorageInitialiser },
			...initialData.skills
		);

		this.disciplines = TraitFactory.newDisciplineTraitCollection(
			{ traitCollectionDataStorageInitialiser, traitDataStorageInitialiser },
			...initialData.disciplines
		);

		this.touchstonesAndConvictions = TraitFactory.newTouchstonesAndConvictionTraitCollection(
			{ traitCollectionDataStorageInitialiser, traitDataStorageInitialiser },
			...initialData.touchstonesAndConvictions
		);

		// todo this shouldnt be here, should be in a data storage object
		// try using resolved custom path, otherwise create path in general location using the user id
		/*
		this.#savePath =
			(customSavePath ? path.resolve(customSavePath) : '') ||
			path.resolve( __dirname, `../data/character-sheets/${ this.discordUserId }.json` );
		*/

		// ? should this be in a data storage object
		// record this instance
		CharacterSheet.instances.set(id, this);
		// CharacterSheet.instances.set(this.#savePath, this);

		// ? is this required?
		// if only user id was provided, assume this is a new sheet then do initial save so a persistent file exists
		// if (typeof sheet === 'number') saveCharacterSheetToFile(this.toJson(), this.#savePath);
	}

	// todo loading and saving should be done by a persistence management class
	/**
	 * Static method to create an instance from an existing character sheet JSON file
	 */
	/*
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

		console.log(`Data imported from ${resolvedPath}`, { data });

		if (!isCharacterSheetData(data))
			throw Error(`Data loaded from path "${resolvedPath}" is not valid character sheet data`);

		// ? is this ok when it specifies local data storage explicitly? this should be implemented in data storage
		const instance = new CharacterSheet({
			characterSheetData: data,
			customSavePath: resolvedPath, dataStorageFactory
		});

		// save instance reference
		CharacterSheet.instances.set(resolvedPath, instance);

		// load the character sheet and set the current location as the save path
		return instance;
	}*/

	public toJson(): iCharacterSheetData {
		const data: iCharacterSheetData = {
			id: this.id,

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

	// todo delete this and use a csDataStorage object
	/*
	private saveToFile( data: iCharacterSheetData, savePath: string ): boolean {
		// this.#savePath
		return exportDataToFile(data, savePath);
	}*/
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
		// combine logs from reports and and sort oldest to newest
		return this.getLogReport()
			.reduce((events, report) => [...events, ...report.logEvents], [] as iLogEvent[])
			.sort((a, b) => {
				return Number(a.timeStamp - b.timeStamp);
			});
	}

	static newDataObject({ id }: iHasId): iCharacterSheetData {
		return {
			id: id,
			bloodPotency: { name: 'Blood Potency', value: 0 },
			health: { name: 'Health', value: 0 },
			humanity: { name: 'Humanity', value: 0 },
			hunger: { name: 'Hunger', value: 0 },
			willpower: { name: 'Willpower', value: 0 },
			name: { name: 'Name', value: '' },
			sire: { name: 'Sire', value: '' },
			clan: { name: 'Clan', value: '' },
			attributes: [],
			disciplines: [],
			skills: [],
			touchstonesAndConvictions: [],
		};
	}
}

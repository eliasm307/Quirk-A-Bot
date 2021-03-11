import { iCanCreateChildTraitCollectionLogger } from './../declarations/interfaces/log-interfaces';
import { STRING_TRAIT_DEFAULT_VALUE } from '../constants';
import {
	iCharacterSheet,
	iCharacterSheetData,
	iCharacterSheetLoaderProps,
	iCharacterSheetProps,
} from '../declarations/interfaces/character-sheet-interfaces';
import { iHasId } from '../declarations/interfaces/data-storage-interfaces';
import { iCharacterSheetLogger, iCharacterSheetLogReporter } from '../declarations/interfaces/log-interfaces';
import {
	iAttributeTraitCollection,
	iDisciplineTraitCollection,
	iSkillTraitCollection,
	iTouchStoneOrConvictionCollection,
} from '../declarations/interfaces/trait-collection-interfaces';
import { iCoreNumberTrait, iCoreStringTrait, iGeneralTrait } from '../declarations/interfaces/trait-interfaces';
import { ClanName, CoreNumberTraitName, CoreStringTraitName } from '../declarations/types';
import { isCharacterSheetData } from '../utils/typePredicates';
import CharacterSheetLogger from './log/CharacterSheetLogger';
import NumberTrait from './traits/NumberTrait';
import StringTrait from './traits/StringTrait';
import TraitFactory from './traits/TraitFactory';

// import saveCharacterSheetToFile from '../utils/saveCharacterSheetToFile';

// todo split this into smaller pieces

// todo add a method to clean up when a character sheet is not in use anymore, ie detach all event listeners to data storage etc

export default class CharacterSheet implements iCharacterSheet {
	//-------------------------------------
	// private properties with custom setters and/or getters

	/** Existing instances of this class */
	protected static instances: Map<string, CharacterSheet> = new Map<string, CharacterSheet>();

	protected logger: iCharacterSheetLogger;

	//-------------------------------------
	// NON BASIC PRIMITIVE VARIABLES
	readonly attributes: iAttributeTraitCollection;
	readonly bloodPotency: iCoreNumberTrait;
	readonly clan: iCoreStringTrait<ClanName>;
	readonly disciplines: iDisciplineTraitCollection;
	readonly health: iCoreNumberTrait;
	readonly humanity: iCoreNumberTrait;
	readonly hunger: iCoreNumberTrait;
	readonly id: string;
	readonly name: iCoreStringTrait<string>;
	readonly sire: iCoreStringTrait<string>;
	readonly skills: iSkillTraitCollection;
	readonly touchstonesAndConvictions: iTouchStoneOrConvictionCollection;
	readonly willpower: iCoreNumberTrait;

	log: iCharacterSheetLogReporter;
	path: string;

	//-------------------------------------
	// PRIVATE CONSTRUCTOR FOR SINGLETONS
	private constructor(props: iCharacterSheetProps) {
		const { id, dataStorageFactory, parentPath, characterSheetDataStorage } = props;

		this.id = id;
		this.path = characterSheetDataStorage.path; // note data storage decides path

		// initialise new top level character sheet logger
		this.logger = new CharacterSheetLogger({ sourceName: this.path, parentLogHandler: null });

		// expose logger reporter
		this.log = this.logger.reporter;

		// create data storage initialisers
		const traitDataStorageInitialiser = dataStorageFactory.newTraitDataStorageInitialiser({
			characterSheet: this,
		});

		const traitCollectionDataStorageInitialiser = dataStorageFactory.newTraitCollectionDataStorageInitialiser({
			characterSheet: this,
		});

		// create core trait logger initialiser function
		const newTraitLogger = (sourceName: string) => this.logger.createChildTraitLogger({ sourceName });

		// get initial data from data storage
		const initialData = characterSheetDataStorage.getData();

		if (!isCharacterSheetData(initialData))
			throw Error(`${__filename} data is not valid character sheet data, "${initialData}"`);

		// ? trait factory could be instantiable so details like the data storage initialisers and parent path could be passed once and not need to be repeated all over
		// core number traits
		this.bloodPotency = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Blood Potency',
			value: initialData.bloodPotency.value || 0,
			traitDataStorageInitialiser,
			parentPath: this.path,
			logger: this.logger.createChildTraitLogger,
		});

		this.hunger = new NumberTrait<CoreNumberTraitName>({
			max: 5,
			name: 'Hunger',
			value: initialData.hunger.value || 0,
			traitDataStorageInitialiser,
			parentPath: this.path,
			logger: this.logger.createChildTraitLogger,
		});

		this.humanity = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Humanity',
			value: initialData.humanity.value || 0,
			traitDataStorageInitialiser,
			parentPath: this.path,
			logger: this.logger.createChildTraitLogger,
		});

		this.health = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Health',
			value: initialData.health.value || 0,
			traitDataStorageInitialiser,
			parentPath: this.path,
			logger: this.logger.createChildTraitLogger,
		});

		this.willpower = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Willpower',
			value: initialData.willpower.value || 0,
			traitDataStorageInitialiser,
			parentPath: this.path,
			logger: this.logger.createChildTraitLogger,
		});

		// core string traits
		this.name = new StringTrait<CoreStringTraitName, string>({
			name: 'Name',
			value: initialData.name.value || STRING_TRAIT_DEFAULT_VALUE,
			traitDataStorageInitialiser,
			parentPath: this.path,
			logger: this.logger.createChildTraitLogger,
		});

		this.sire = new StringTrait<CoreStringTraitName, string>({
			name: 'Sire',
			value: initialData.sire.value || STRING_TRAIT_DEFAULT_VALUE,
			traitDataStorageInitialiser,
			parentPath: this.path,
			logger: this.logger.createChildTraitLogger,
		});

		this.clan = new StringTrait<CoreStringTraitName, ClanName>({
			name: 'Clan',
			value: initialData.clan.value || STRING_TRAIT_DEFAULT_VALUE,
			traitDataStorageInitialiser,
			parentPath: this.path,
			logger: this.logger.createChildTraitLogger,
		});

		// ? what if the trait factory wasnt static and actually took in arguments on instantiation, this would reduce some of the props required when using each factory method and hide some of the ugliness

		// create collections, with initial data where available
		this.attributes = TraitFactory.newAttributeTraitCollection(
			{
				traitCollectionDataStorageInitialiser,
				traitDataStorageInitialiser,
				parentPath: this.path,
				logger: this.logger.createChildTraitCollectionLogger,
			},
			...initialData.attributes
		);

		this.skills = TraitFactory.newSkillTraitCollection(
			{
				traitCollectionDataStorageInitialiser,
				traitDataStorageInitialiser,
				parentPath: this.path,
				logger: this.logger.createChildTraitCollectionLogger,
			},
			...initialData.skills
		);

		this.disciplines = TraitFactory.newDisciplineTraitCollection(
			{
				traitCollectionDataStorageInitialiser,
				traitDataStorageInitialiser,
				parentPath: this.path,
				logger: this.logger.createChildTraitCollectionLogger,
			},
			...initialData.disciplines
		);

		this.touchstonesAndConvictions = TraitFactory.newTouchstonesAndConvictionTraitCollection(
			{
				traitCollectionDataStorageInitialiser,
				traitDataStorageInitialiser,
				parentPath: this.path,
				logger: this.logger.createChildTraitCollectionLogger,
			},
			...initialData.touchstonesAndConvictions
		);

		// ? should this be in a data storage object
		// record this instance
		CharacterSheet.instances.set(id, this);
	}

	// todo move to standalone util
	// SINGLETON CONSTRUCTOR
	static async load(props: iCharacterSheetLoaderProps): Promise<CharacterSheet> {
		const { dataStorageFactory, id } = props;

		// ? should data storage decide what is a valid id?
		const isValidId = (id: string): boolean => {
			// id should only contain alpha numeric characters
			return !/\W\-/.test(id);
		};

		if (!isValidId(id)) {
			throw Error(
				`Id "${id}" is not a valid character sheet id. This should only contain alpha numeric characters, underscores, or dashes.`
			);
			// return;
		}

		const preExistingInstance = CharacterSheet.instances.get(id);

		// if an instance has already been created with this id then use that instance
		if (preExistingInstance) return preExistingInstance;

		// check if a character sheet with this id doesnt exist in the data storage, initialise a blank character sheet if not
		const characterSheetDataStorage = dataStorageFactory.newCharacterSheetDataStorage(props);

		try {
			// makes sure some data exists for the character sheet instance to link to
			await characterSheetDataStorage.assertDataExistsOnDataStorage();

			// return a new character sheet instance as requested
			// Note a character sheet instance only creates an object that is connected to a character sheet on the data source, it doesnt initialise a new character sheet on the data source
			return new CharacterSheet({ ...props, characterSheetDataStorage });
		} catch (error) {
			console.error(__filename, { error });
			throw Error(`Error creating character sheet instance with id ${id}`);
		}
	}

	/** Returns a new iCharacterSheetData object with default values */
	static newDataObject({ id }: iHasId): iCharacterSheetData {
		// todo move to standalone util
		return {
			id,
			bloodPotency: { name: 'Blood Potency', value: 0 },
			health: { name: 'Health', value: 0 },
			humanity: { name: 'Humanity', value: 0 },
			hunger: { name: 'Hunger', value: 0 },
			willpower: { name: 'Willpower', value: 0 },
			name: { name: 'Name', value: STRING_TRAIT_DEFAULT_VALUE },
			sire: { name: 'Sire', value: STRING_TRAIT_DEFAULT_VALUE },
			clan: { name: 'Clan', value: STRING_TRAIT_DEFAULT_VALUE },
			attributes: [],
			disciplines: [],
			skills: [],
			touchstonesAndConvictions: [],
		};
	}

	/*
  *
  getLogEvents(): iLogEvent[] {
		// combine logs from reports and and sort oldest to newest
		return this.getLogReports()
			.reduce((events, report) => [...events, ...report.events], [] as iLogEvent[])
			.sort((a, b) => {
				return Number(a.timeStamp - b.timeStamp);
			});
	}

  // todo character sheet shouldnt handle logs, this should be done similar to traits, expose a refernce to the internal logger then attach these methods to it
  getLogReports(): iBaseLogReport[] {
		// todo test
		return this.getAllTraits().map(trait => trait.log.getLogReport());
  }

*/
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

	// ? should this be public?
	private getAllTraits(): iGeneralTrait[] {
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
}

// import saveCharacterSheetToFile from '../utils/saveCharacterSheetToFile';

import { STRING_TRAIT_DEFAULT_VALUE } from '../../constants';
import { ClanName } from '../../declarations/types';
import { iHasId } from '../data-storage/interfaces/data-storage-interfaces';
import CharacterSheetLogger from '../log/CharacterSheetLogger';
import {
  iCharacterSheetLogger, iCharacterSheetLogReporter, iChildLoggerCreatorProps
} from '../log/interfaces/log-interfaces';
import {
  iAttributeTraitCollection, iDisciplineTraitCollection, iSkillTraitCollection,
  iTouchStoneOrConvictionCollection, iTraitCollectionFactoryMethodProps
} from '../traits/interfaces/trait-collection-interfaces';
import {
  iCoreNumberTrait, iCoreStringTrait, iGeneralTrait
} from '../traits/interfaces/trait-interfaces';
import TraitFactory from '../traits/TraitFactory';
import {
  iCharacterSheet, iCharacterSheetData, iCharacterSheetLoaderProps, iCharacterSheetProps
} from './interfaces/character-sheet-interfaces';
import characterSheetToData from './utils/characterSheetToData';
import newCharacterSheetData from './utils/newCharacterSheetData';

// todo split this into smaller pieces

// todo add a method to clean up when a character sheet is not in use anymore, ie detach all event listeners to data storage etc

export default class CharacterSheet implements iCharacterSheet {
	/** Existing singleton-ish instances of this class */
	protected static instances: Map<string, CharacterSheet> = new Map<string, CharacterSheet>();

	/** Internal logger */
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

		// get initial data from data storage
		const initialData = characterSheetDataStorage.getData();

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
		const traitLoggerCreator = (props: iChildLoggerCreatorProps) => this.logger.createChildTraitLogger(props);

		const traitCollectionLoggerCreator = (props: iChildLoggerCreatorProps) =>
			this.logger.createChildTraitCollectionLogger(props);

		// create partial trait factory method props
		const partialTraitFactoryProps = {
			traitDataStorageInitialiser,
			parentPath: this.path,
			logger: traitLoggerCreator,
		};

		// create traitCollection factory method props
		const traitCollectionFactoryProps: iTraitCollectionFactoryMethodProps = {
			traitCollectionDataStorageInitialiser,
			traitDataStorageInitialiser,
			parentPath: this.path,
			logger: traitCollectionLoggerCreator,
		};

		// core number traits
		this.bloodPotency = TraitFactory.newCoreNumberTrait({
			...partialTraitFactoryProps,
			max: 10,
			name: 'Blood Potency',
			value: initialData.bloodPotency.value || 0,
		});

		this.hunger = TraitFactory.newCoreNumberTrait({
			...partialTraitFactoryProps,
			max: 5,
			name: 'Hunger',
			value: initialData.hunger.value || 0,
		});

		this.humanity = TraitFactory.newCoreNumberTrait({
			...partialTraitFactoryProps,
			max: 10,
			name: 'Humanity',
			value: initialData.humanity.value || 0,
		});

		this.health = TraitFactory.newCoreNumberTrait({
			...partialTraitFactoryProps,
			max: 10,
			name: 'Health',
			value: initialData.health.value || 0,
		});

		this.willpower = TraitFactory.newCoreNumberTrait({
			...partialTraitFactoryProps,
			max: 10,
			name: 'Willpower',
			value: initialData.willpower.value || 0,
		});

		// core string traits
		this.name = TraitFactory.newCoreStringTrait<string>({
			...partialTraitFactoryProps,
			name: 'Name',
			value: initialData.name.value || STRING_TRAIT_DEFAULT_VALUE,
		});

		this.sire = TraitFactory.newCoreStringTrait<string>({
			...partialTraitFactoryProps,
			name: 'Sire',
			value: initialData.sire.value || STRING_TRAIT_DEFAULT_VALUE,
		});

		this.clan = TraitFactory.newCoreStringTrait<ClanName>({
			...partialTraitFactoryProps,
			name: 'Clan',
			value: initialData.clan.value || STRING_TRAIT_DEFAULT_VALUE,
		});

		// create collections, with initial data where available
		this.attributes = TraitFactory.newAttributeTraitCollection(traitCollectionFactoryProps, ...initialData.attributes);

		this.skills = TraitFactory.newSkillTraitCollection(traitCollectionFactoryProps, ...initialData.skills);

		this.disciplines = TraitFactory.newDisciplineTraitCollection(
			traitCollectionFactoryProps,
			...initialData.disciplines
		);

		this.touchstonesAndConvictions = TraitFactory.newTouchstonesAndConvictionTraitCollection(
			traitCollectionFactoryProps,
			...initialData.touchstonesAndConvictions
		);

		// record this instance using id and path as keys
		CharacterSheet.instances.set(this.id, this);
		CharacterSheet.instances.set(this.path, this);
	}

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
			throw Error(`Could not create character sheet instance with id "${id}", Message: ${error}`);
		}
	}

	/** Returns a new iCharacterSheetData object with default values */
	static newDataObject(props: iHasId): iCharacterSheetData {
		return newCharacterSheetData(props);
	}

	public toJson(): iCharacterSheetData {
		return characterSheetToData(this);
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

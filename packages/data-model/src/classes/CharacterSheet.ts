import { iHasId } from './../declarations/interfaces/data-storage-interfaces';
import { iCharacterSheet, iCharacterSheetLoaderProps } from './../declarations/interfaces/character-sheet-interfaces';
import { iLogReport } from './../declarations/interfaces/log-interfaces';
import {
	iAttributeTraitCollection,
	iSkillTraitCollection,
	iDisciplineTraitCollection,
	iTouchStoneOrConvictionCollection,
} from './../declarations/interfaces/trait-collection-interfaces';
import { CoreNumberTraitName, CoreStringTraitName, ClanName } from './../declarations/types';
import { iCoreStringTrait, iCoreNumberTrait, iGeneralTrait } from './../declarations/interfaces/trait-interfaces';
import { iCharacterSheetData, iCharacterSheetProps } from '../declarations/interfaces/character-sheet-interfaces';
import { iLogEvent } from '../declarations/interfaces/log-interfaces';
import TraitFactory from './traits/TraitFactory';
import StringTrait from './traits/StringTrait';
import { isCharacterSheetData } from '../utils/typePredicates';
import NumberTrait from './traits/NumberTrait';
import { createPath } from '../utils/createPath';
import { STRING_TRAIT_DEFAULT_VALUE } from '../constants';
// import saveCharacterSheetToFile from '../utils/saveCharacterSheetToFile';

// todo split this into smaller pieces

// todo add a method to clean up when a character sheet is not in use anymore, ie detach all event listeners to data storage etc

export default class CharacterSheet implements iCharacterSheet {
	path: string;
	readonly id: string;
	//-------------------------------------
	// private properties with custom setters and/or getters

	/** Existing instances of this class */
	protected static instances: Map<string, CharacterSheet> = new Map<string, CharacterSheet>();

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

	// todo move to standalone util
	// SINGLETON CONSTRUCTOR
	static async load(props: iCharacterSheetLoaderProps): Promise<CharacterSheet> {
		const { dataStorageFactory, id } = props;

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

	//-------------------------------------
	// PRIVATE CONSTRUCTOR
	private constructor(props: iCharacterSheetProps) {
		const { id, dataStorageFactory, parentPath, characterSheetDataStorage } = props;

		this.id = id;
		this.path = createPath(parentPath, id);

		const traitDataStorageInitialiser = dataStorageFactory.newTraitDataStorageInitialiser({
			characterSheet: this,
		});

		const traitCollectionDataStorageInitialiser = dataStorageFactory.newTraitCollectionDataStorageInitialiser({
			characterSheet: this,
		});

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
		});

		this.hunger = new NumberTrait<CoreNumberTraitName>({
			max: 5,
			name: 'Hunger',
			value: initialData.hunger.value || 0,
			traitDataStorageInitialiser,
			parentPath: this.path,
		});

		this.humanity = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Humanity',
			value: initialData.humanity.value || 0,
			traitDataStorageInitialiser,
			parentPath: this.path,
		});

		this.health = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Health',
			value: initialData.health.value || 0,
			traitDataStorageInitialiser,
			parentPath: this.path,
		});

		this.willpower = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Willpower',
			value: initialData.willpower.value || 0,
			traitDataStorageInitialiser,
			parentPath: this.path,
		});

		// core string traits
		this.name = new StringTrait<CoreStringTraitName, string>({
			name: 'Name',
			value: initialData.name.value || STRING_TRAIT_DEFAULT_VALUE,
			traitDataStorageInitialiser,
			parentPath: this.path,
		});

		this.sire = new StringTrait<CoreStringTraitName, string>({
			name: 'Sire',
			value: initialData.sire.value || STRING_TRAIT_DEFAULT_VALUE,
			traitDataStorageInitialiser,
			parentPath: this.path,
		});

		this.clan = new StringTrait<CoreStringTraitName, ClanName>({
			name: 'Clan',
			value: initialData.clan.value || STRING_TRAIT_DEFAULT_VALUE,
			traitDataStorageInitialiser,
			parentPath: this.path,
		});

		// ? what if the trait factory wasnt static and actually took in arguments on instantiation, this would reduce some of the props required when using each factory method and hide some of the ugliness

		// create collections, with initial data where available
		this.attributes = TraitFactory.newAttributeTraitCollection(
			{ traitCollectionDataStorageInitialiser, traitDataStorageInitialiser, parentPath: this.path },
			...initialData.attributes
		);

		this.skills = TraitFactory.newSkillTraitCollection(
			{ traitCollectionDataStorageInitialiser, traitDataStorageInitialiser, parentPath: this.path },
			...initialData.skills
		);

		this.disciplines = TraitFactory.newDisciplineTraitCollection(
			{ traitCollectionDataStorageInitialiser, traitDataStorageInitialiser, parentPath: this.path },
			...initialData.disciplines
		);

		this.touchstonesAndConvictions = TraitFactory.newTouchstonesAndConvictionTraitCollection(
			{ traitCollectionDataStorageInitialiser, traitDataStorageInitialiser, parentPath: this.path },
			...initialData.touchstonesAndConvictions
		);

		// ? should this be in a data storage object
		// record this instance
		CharacterSheet.instances.set(id, this);
	}

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

	// todo character sheet shouldnt handle logs, this should be done similar to traits, expose a refernce to the internal logger then attach these methods to it
	getLogReports(): iLogReport[] {
		// todo test
		return this.getAllTraits().map(trait => trait.getLogReport());
	}
	getLogEvents(): iLogEvent[] {
		// combine logs from reports and and sort oldest to newest
		return this.getLogReports()
			.reduce((events, report) => [...events, ...report.logEvents], [] as iLogEvent[])
			.sort((a, b) => {
				return Number(a.timeStamp - b.timeStamp);
			});
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
}

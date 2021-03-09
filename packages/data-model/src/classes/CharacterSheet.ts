import { iHasId } from './../declarations/interfaces/data-storage-interfaces';
import { iCharacterSheet } from './../declarations/interfaces/character-sheet-interfaces';
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
// import saveCharacterSheetToFile from '../utils/saveCharacterSheetToFile';

// ! this shouldnt be here, should be in a file about persistence
interface iLoadFromFileArgs {
	filePath?: string;
	fileName?: string;
}

// todo split this into smaller pieces

// todo add a method to clean up when a character sheet is not in use anymore, ie detach all event listeners to data storage etc

export default class CharacterSheet implements iCharacterSheet {
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

	// SINGLETON CONSTRUCTOR
	static load(props: iCharacterSheetProps): CharacterSheet {
		// todo move to standalone util
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
	// PRIVATE CONSTRUCTOR
	private constructor({ id, dataStorageFactory }: iCharacterSheetProps) {
		const traitDataStorageInitialiser = dataStorageFactory.newTraitDataStorageInitialiser({
			characterSheet: this,
		});

		const traitCollectionDataStorageInitialiser = dataStorageFactory.newTraitCollectionDataStorageInitialiser({
			characterSheet: this,
		});

		const characterSheetDataStorage = dataStorageFactory.newCharacterSheetDataStorage({ id });

		const initialData = characterSheetDataStorage.getData();

		if (!isCharacterSheetData(initialData))
			throw Error(`${__filename} data is an object but it is not valid character sheet data, "${initialData}"`);

		this.id = id;

		// core number traits
		this.bloodPotency = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Blood Potency',
			value: initialData.bloodPotency.value || 0,
			traitDataStorageInitialiser,
			parentPath: id,
		});

		this.hunger = new NumberTrait<CoreNumberTraitName>({
			max: 5,
			name: 'Hunger',
			value: initialData.hunger.value || 0,
			traitDataStorageInitialiser,
			parentPath: id,
		});

		this.humanity = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Humanity',
			value: initialData.humanity.value || 0,
			traitDataStorageInitialiser,
			parentPath: id,
		});

		this.health = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Health',
			value: initialData.health.value || 0,
			traitDataStorageInitialiser,
			parentPath: id,
		});

		this.willpower = new NumberTrait<CoreNumberTraitName>({
			max: 10,
			name: 'Willpower',
			value: initialData.willpower.value || 0,
			traitDataStorageInitialiser,
			parentPath: id,
		});

		// core string traits
		this.name = new StringTrait<CoreStringTraitName, string>({
			name: 'Name',
			value: initialData.name.value || 'TBC',
			traitDataStorageInitialiser,
			parentPath: id,
		});

		this.sire = new StringTrait<CoreStringTraitName, string>({
			name: 'Sire',
			value: initialData.sire.value || 'TBC',
			traitDataStorageInitialiser,
			parentPath: id,
		});

		this.clan = new StringTrait<CoreStringTraitName, ClanName>({
			name: 'Clan',
			value: initialData.clan.value || 'TBC',
			traitDataStorageInitialiser,
			parentPath: id,
		});

		// create collections, with initial data where available
		this.attributes = TraitFactory.newAttributeTraitCollection(
			{ traitCollectionDataStorageInitialiser, traitDataStorageInitialiser, parentPath: id },
			...initialData.attributes
		);

		this.skills = TraitFactory.newSkillTraitCollection(
			{ traitCollectionDataStorageInitialiser, traitDataStorageInitialiser, parentPath: id },
			...initialData.skills
		);

		this.disciplines = TraitFactory.newDisciplineTraitCollection(
			{ traitCollectionDataStorageInitialiser, traitDataStorageInitialiser, parentPath: id },
			...initialData.disciplines
		);

		this.touchstonesAndConvictions = TraitFactory.newTouchstonesAndConvictionTraitCollection(
			{ traitCollectionDataStorageInitialiser, traitDataStorageInitialiser, parentPath: id },
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

	/** Returns a new iCharacterSheetData object with default values */
	static newDataObject({ id }: iHasId): iCharacterSheetData {
		// todo move to standalone util
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

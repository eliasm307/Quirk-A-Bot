// import saveCharacterSheetToFile from '../utils/saveCharacterSheetToFile';
import { iHasId } from '../../declarations/interfaces';
import { ClanName } from '../../declarations/types';
import hasCleanUp from '../../utils/type-predicates/hasCleanUp';
import {
  iCharacterSheetLogger, iCharacterSheetLogReporter, iChildLoggerCreatorProps,
} from '../log/interfaces/log-interfaces';
import CharacterSheetLogger from '../log/loggers/CharacterSheetLogger';
import {
  iAttributeTraitCollection, iCoreNumberTraitCollection, iCoreStringTraitCollection,
  iDisciplineTraitCollection, iSkillTraitCollection, iTouchStoneOrConvictionCollection,
} from '../traits/interfaces/trait-collection-interfaces';
import {
  iCoreNumberTrait, iCoreNumberTraitData, iCoreStringTrait, iCoreStringTraitData,
} from '../traits/interfaces/trait-interfaces';
import TraitFactory from '../traits/TraitFactory';
import {
  iCharacterSheet, iCharacterSheetDataOLD, iCharacterSheetLoaderProps, iCharacterSheetProps,
} from './interfaces/character-sheet-interfaces';
import characterSheetToData from './utils/characterSheetToData';
import newCharacterSheetData from './utils/newCharacterSheetData';

// todo split this into smaller pieces

// todo add a method to clean up when a character sheet is not in use anymore, ie detach all event listeners to data storage etc

export default class CharacterSheet implements iCharacterSheet {
  /** Existing singleton-ish instances of this class */
  protected static instances: Map<string, CharacterSheet> = new Map();

  /** Internal logger */
  protected logger: iCharacterSheetLogger;

  //-------------------------------------
  // NON-BASIC-PRIMITIVE VARIABLES
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

  #coreNumberTraitCollection: iCoreNumberTraitCollection;
  #coreStringTraitCollection: iCoreStringTraitCollection;
  #isFullyInitialised: boolean;
  log: iCharacterSheetLogReporter;
  parentPath: string;
  path: string;

  //-------------------------------------
  // PRIVATE CONSTRUCTOR FOR SINGLETONS
  private constructor(props: iCharacterSheetProps) {
    const { id, dataStorageFactory, parentPath, characterSheetDataStorage } =
      props;

    this.id = id;
    this.parentPath = parentPath;
    this.path = characterSheetDataStorage.path; // note data storage decides path

    // get initial data from data storage
    const initialData = characterSheetDataStorage.getData();

    // initialise new top level character sheet logger
    this.logger = new CharacterSheetLogger({
      sourceName: this.path,
      parentLogHandler: null,
    });

    // expose logger reporter
    this.log = this.logger.reporter;

    const traitCollectionDataStorageInitialiser =
      dataStorageFactory.newTraitCollectionDataStorageInitialiser({
        characterSheet: this,
      });

    // ? is this required?
    // create core trait logger initialiser function
    const traitLoggerCreator = (
      traitLoggerCreatorProps: iChildLoggerCreatorProps
    ) => this.logger.createChildTraitLogger(traitLoggerCreatorProps);

    const traitCollectionLoggerCreator = (
      traitCollectionLoggerCreatorProps: iChildLoggerCreatorProps
    ) =>
      this.logger.createChildTraitCollectionLogger(
        traitCollectionLoggerCreatorProps
      );

    const {
      bloodPotency,
      hunger,
      humanity,
      health,
      willpower,
      clan,
      name,
      sire,
    } = initialData;

    // core number traits

    const initialCoreNumberTraitData: iCoreNumberTraitData[] = [
      bloodPotency,
      hunger,
      humanity,
      health,
      willpower,
    ];

    const initialCoreStringTraitData: iCoreStringTraitData<string>[] = [
      clan,
      name,
      sire,
    ];

    // create traitCollection factory method props
    const traitCollectionFactoryProps = {
      traitCollectionDataStorageInitialiser,
      parentPath: this.path,
      loggerCreator: traitCollectionLoggerCreator,
      dataStorageFactory,
    };

    // create collections, with initial data where available

    this.#coreNumberTraitCollection = TraitFactory.newCoreNumberTraitCollection(
      traitCollectionFactoryProps,
      ...initialCoreNumberTraitData
    );

    this.#coreStringTraitCollection = TraitFactory.newCoreStringTraitCollection(
      traitCollectionFactoryProps,
      ...initialCoreStringTraitData
    );

    this.attributes = TraitFactory.newAttributeTraitCollection(
      traitCollectionFactoryProps,
      ...initialData.attributes
    );

    this.skills = TraitFactory.newSkillTraitCollection(
      traitCollectionFactoryProps,
      ...initialData.skills
    );

    this.disciplines = TraitFactory.newDisciplineTraitCollection(
      traitCollectionFactoryProps,
      ...initialData.disciplines
    );

    this.touchstonesAndConvictions =
      TraitFactory.newTouchstonesAndConvictionTraitCollection(
        traitCollectionFactoryProps,
        ...initialData.touchstonesAndConvictions
      );

    // core number traits
    this.bloodPotency = this.#coreNumberTraitCollection.get(
      "Blood Potency"
    ) as iCoreNumberTrait;
    this.hunger = this.#coreNumberTraitCollection.get(
      "Hunger"
    ) as iCoreNumberTrait;
    this.humanity = this.#coreNumberTraitCollection.get(
      "Humanity"
    ) as iCoreNumberTrait;
    this.health = this.#coreNumberTraitCollection.get(
      "Health"
    ) as iCoreNumberTrait;
    this.willpower = this.#coreNumberTraitCollection.get(
      "Willpower"
    ) as iCoreNumberTrait;

    // core string traits
    this.name = this.#coreStringTraitCollection.get("Name") as iCoreStringTrait;
    this.sire = this.#coreStringTraitCollection.get("Sire") as iCoreStringTrait;
    this.clan = this.#coreStringTraitCollection.get(
      "Clan"
    ) as iCoreStringTrait<ClanName>;

    // record this instance using id and path as keys
    CharacterSheet.instances.set(this.id, this);
    CharacterSheet.instances.set(this.path, this);

    // flag to mark that initialisation was completed
    this.#isFullyInitialised = true;
  }

  /** SINGLETON CONSTRUCTOR **/
  static async load(
    props: iCharacterSheetLoaderProps
  ): Promise<CharacterSheet> {
    const { dataStorageFactory, id } = props;

    dataStorageFactory.assertIdIsValid(id);

    const preExistingInstance = CharacterSheet.instances.get(id);

    // if an instance has already been created with this id then use that instance
    if (preExistingInstance) return preExistingInstance;

    // check if a character sheet with this id doesn't  exist in the data storage, initialise a blank character sheet if not
    const characterSheetDataStorage =
      dataStorageFactory.newCharacterSheetDataStorage(props);

    try {
      // makes sure some data exists for the character sheet instance to link to
      await characterSheetDataStorage.assertDataExistsOnDataStorage();

      // return a new character sheet instance as requested
      // Note a character sheet instance only creates an object that is connected to a character sheet on the data source, it doesn't initialise a new character sheet on the data source
      return new CharacterSheet({ ...props, characterSheetDataStorage });
    } catch (error) {
      console.error(__filename, { error });
      throw Error(
        `Could not create character sheet instance with id "${id}", Message: ${JSON.stringify(
          error
        )}`
      );
    }
  }

  /** Returns a new iCharacterSheetData object with default values */
  static newDataObject(props: iHasId): iCharacterSheetDataOLD {
    return newCharacterSheetData(props);
  }

  cleanUp(): boolean {
    /*
    const coreTraits: iCharacterSheetShape = {
      attributes: this.attributes,
      bloodPotency: this.bloodPotency,
      clan: this.clan,
      disciplines: this.disciplines,
      health: this.health,
      humanity: this.humanity,
      hunger: this.hunger,
      id: this.id,
      name: this.name,
      sire: this.sire,
      skills: this.skills,
      touchstonesAndConvictions: this.touchstonesAndConvictions,
      willpower: this.willpower,
    };
    */

    let total = 0;
    let successCount = 0;
    let failCount = 0;

    // clean any cleanable properties
    for (const [propName, prop] of Object.entries(this)) {
      if (hasCleanUp(prop)) {
        total++;
        if (prop.cleanUp()) {
          successCount++;
        } else {
          console.warn(
            __filename,
            `There was an issue cleaning up ${propName}`
          );
          failCount++;
        }
      }
    }

    // if there are failures
    if (failCount)
      console.warn(
        __filename,
        `Cleaned ${successCount} / ${total} items Successfully, but ${failCount} / ${total} were unsuccessful`
      );

    // successful if no failures
    return !failCount;
  }

  public data(): iCharacterSheetDataOLD {
    // ? is this a good way to do it? The issue is trait collections need to populate initially, and some data storages e.g. local files auto save and call this method before the method is ready
    return this.#isFullyInitialised
      ? characterSheetToData(this)
      : CharacterSheet.newDataObject({ id: this.id });
  }

  // ? is this required
  /*
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
  */
}

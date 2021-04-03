import { iHasParentPath } from '../../declarations/interfaces';
import { iCharacterSheet } from '../character-sheet/interfaces/character-sheet-interfaces';
import {
  iGameDataStorage, iHasDataStorageFactory, iHasId,
} from '../data-storage/interfaces/data-storage-interfaces';
import { iPlayerGame } from './interfaces';

interface PlayerGameProps extends iLoaderProps {
  gameDataStorage: iGameDataStorage;
}

// ? similar to characterSheetDataStorage loader, should these be the same?
interface iLoaderProps extends iHasId, iHasDataStorageFactory, iHasParentPath {}

export default class PlayerGame implements iPlayerGame {
  /** Existing singleton-ish instances of this class */
  protected static instances: Map<string, PlayerGame> = new Map<
    string,
    PlayerGame
  >();

  botWebsocketUri?: string | undefined;
  characterSheets: Map<string, iCharacterSheet>;
  description: string;
  id: string;
  parentPath: string;

  constructor({
    id,
    dataStorageFactory,
    gameDataStorage,
    parentPath,
  }: PlayerGameProps) {
    this.id = id;
    this.parentPath = parentPath;

    // get initial data from data storage
    const { description } = gameDataStorage.getData();
    this.description = description;
    this.characterSheets = gameDataStorage.getCharacterSheets();
  }

  /** SINGLETON CONSTRUCTOR **/
  static async load(props: iLoaderProps): Promise<PlayerGame> {
    const { dataStorageFactory, id } = props;

    if (!dataStorageFactory.idIsValid(id)) {
      throw Error(
        `Id "${id}" is not a valid game id. This should only contain alpha numeric characters, underscores, or dashes.`
      );
      // return;
    }

    const preExistingInstance = PlayerGame.instances.get(id);

    // if an instance has already been created with this id then use that instance
    if (preExistingInstance) return preExistingInstance;

    // check if a character sheet with this id doesnt exist in the data storage, initialise a blank character sheet if not
    const gameDataStorage = dataStorageFactory.newGameDataStorage(props);

    try {
      // makes sure some data exists for the character sheet instance to link to
      await gameDataStorage.assertDataExistsOnDataStorage();

      // return a new character sheet instance as requested
      // Note a character sheet instance only creates an object that is connected to a character sheet on the data source, it doesnt initialise a new character sheet on the data source
      return new PlayerGame({ ...props, gameDataStorage, dataStorageFactory });
    } catch (error) {
      console.error(__filename, { error });
      throw Error(
        `Could not create character sheet instance with id "${id}", Message: ${error}`
      );
    }
  }
}

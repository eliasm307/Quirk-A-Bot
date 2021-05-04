import { iHasParentPath } from '@quirk-a-bot/common';

import { iHasId } from '../../declarations/interfaces';
import { iCharacterSheet } from '../character-sheet/interfaces/character-sheet-interfaces';
import {
  iGameDataStorage, iHasDataStorageFactory,
} from '../data-storage/interfaces/data-storage-interfaces';
import { iTraitCollection } from '../traits/interfaces/trait-collection-interfaces';
import { iBaseTrait, iBaseTraitData, iStringTrait } from '../traits/interfaces/trait-interfaces';
import { iGame } from './interfaces/game-interfaces';
import { iGamePlayerData } from './interfaces/game-player-interfaces';

// ? similar to characterSheetDataStorage loader, should these be the same?
interface iLoaderProps extends iHasId, iHasDataStorageFactory, iHasParentPath {}

export interface iGameProps extends iLoaderProps {
  gameDataStorage: iGameDataStorage;
}

// interface Props extends iGameProps {}

export default class Game implements iGame {
  /** Existing singleton-ish instances of this class */
  protected static instances: Map<string, Game> = new Map<string, Game>();

  botWebsocketUri?: string | undefined;
  characterSheetIds: string[];
  characterSheets: Map<string, iCharacterSheet>;
  description: iStringTrait<string, string>;
  gameMasters: iTraitCollection<
    string,
    string,
    iBaseTraitData<string, string>,
    iBaseTrait<string, string, iBaseTraitData<string, string>>
  >;
  id: string;
  parentPath: string;
  players: iGamePlayerData[];

  constructor({
    id,
    dataStorageFactory,
    gameDataStorage,
    parentPath,
  }: iGameProps) {
    this.id = id;
    this.parentPath = parentPath;
    throw Error("Not implemented");
    // get initial data from data storage
    /*
    const { description } = gameDataStorage.getData();
    this.description = description;
    this.characterSheets = gameDataStorage.getCharacterSheets();
    */
  }

  /** SINGLETON CONSTRUCTOR **/
  static async load(props: iLoaderProps): Promise<Game> {
    const { dataStorageFactory, id } = props;

    if (!dataStorageFactory.idIsValid(id)) {
      throw Error(
        `Id "${id}" is not a valid game id. This should only contain alpha numeric characters, underscores, or dashes.`
      );
      // return;
    }

    const preExistingInstance = Game.instances.get(id);

    // if an instance has already been created with this id then use that instance
    if (preExistingInstance) return preExistingInstance;

    // check if a character sheet with this id doesn't  exist in the data storage, initialise a blank character sheet if not
    const gameDataStorage = dataStorageFactory.newGameDataStorage(props);

    try {
      // makes sure some data exists for the character sheet instance to link to
      await gameDataStorage.assertDataExistsOnDataStorage();

      // return a new character sheet instance as requested
      // Note a character sheet instance only creates an object that is connected to a character sheet on the data source, it doesn't  initialise a new character sheet on the data source
      return new Game({ ...props, gameDataStorage, dataStorageFactory });
    } catch (error) {
      console.error(__filename, { error });
      throw Error(
        `Could not create character sheet instance with id "${id}", Message: ${JSON.stringify(
          error
        )}`
      );
    }
  }

  acceptPlayerRequest(playerId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  rejectPlayerRequest(playerId: string, reason?: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  removePlayer(playerId: string, reason?: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

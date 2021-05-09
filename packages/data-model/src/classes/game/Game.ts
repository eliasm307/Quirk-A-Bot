import { iHasParentPath, UID } from '@quirk-a-bot/common';

import { iHasId } from '../../declarations/interfaces';
import { iCharacterSheet } from '../character-sheet/interfaces/character-sheet-interfaces';
import {
  iDataStorageFactory, iGameDataStorage, iHasDataStorageFactory,
} from '../data-storage/interfaces/data-storage-interfaces';
import { iGame, iGameData } from './interfaces/game-interfaces';
import { iCharacterData } from './interfaces/game-player-interfaces';

// ? similar to characterSheetDataStorage loader, should these be the same?
interface iLoaderProps extends iHasId, iHasDataStorageFactory, iHasParentPath {}

export interface iGameProps extends iLoaderProps {
  gameDataStorage: iGameDataStorage;
  initialCharacterData: iCharacterData[];
  initialData: iGameData;
}

export default class Game implements iGame {
  /** Existing singleton instances of this class */
  protected static instances: Map<string, Game> = new Map<string, Game>();

  #dataStorageFactory: iDataStorageFactory;
  #gameDataStorage: iGameDataStorage;
  characters: Map<string, iCharacterData>;
  description: string;
  discordBotWebSocketServer?: string;
  gameMasters: Set<string>;
  id: string;
  parentPath: string;

  private constructor({
    id,
    dataStorageFactory,
    gameDataStorage,
    parentPath,
    initialCharacterData,
    initialData,
  }: iGameProps) {
    this.id = id;
    this.parentPath = parentPath;
    this.#dataStorageFactory = dataStorageFactory;
    this.#gameDataStorage = gameDataStorage;

    this.gameMasters = new Set(initialData.gameMasters);

    this.description = gameDataStorage.description;

    this.characters = new Map(
      initialCharacterData.map((character) => [character.id, character])
    );
  }

  /** Loads a game instance **/
  static async load(props: iLoaderProps): Promise<Game> {
    const { dataStorageFactory, id } = props;

    dataStorageFactory.assertIdIsValid(id);

    const preExistingInstance = Game.instances.get(id);

    // if an instance has already been created with this id then use that instance
    if (preExistingInstance) return preExistingInstance;

    try {
      const gameDataStorage = dataStorageFactory.newGameDataStorage(props);

      // check if a character sheet with this id doesn't  exist in the data storage, initialise a blank character sheet if not
      await gameDataStorage.assertDataExistsOnDataStorage();

      const initialData = await gameDataStorage.getData();

      const initialCharacterData = await gameDataStorage.getCharacters();

      return new Game({
        ...props,
        gameDataStorage,
        dataStorageFactory,
        initialCharacterData,
        initialData,
      });
    } catch (error) {
      console.error(__filename, { error });
      throw Error(
        `Could not create character sheet instance with id "${id}", Message: ${JSON.stringify(
          error
        )}`
      );
    }
  }

  addCharacter(id: string): Promise<void> {
    return this.#gameDataStorage.addCharacter(id);
  }

  async loadCharacterSheets(): Promise<Map<UID, iCharacterSheet>> {
    const characterSheets = await this.#gameDataStorage.getCharacterSheets();

    if (!characterSheets || !characterSheets.length) return new Map();

    return new Map(
      characterSheets.map((characterSheet) => [
        characterSheet.id,
        characterSheet,
      ])
    );
  }

  setDescription(description: string): Promise<void> {
    return this.#gameDataStorage.setDescription(description);
  }
}

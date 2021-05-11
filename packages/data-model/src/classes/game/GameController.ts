import { iHasParentPath, UID } from '@quirk-a-bot/common';

import { iHasId } from '../../declarations/interfaces';
import CharacterSheet from '../character-sheet/CharacterSheet';
import { iCharacterSheet } from '../character-sheet/interfaces/character-sheet-interfaces';
import {
  iDataStorageFactory, iGameDataStorage, iHasDataStorageFactory,
} from '../data-storage/interfaces/data-storage-interfaces';
import { createPath } from '../data-storage/utils/createPath';
import { iGame as iGameController, iGameData } from './interfaces/game-interfaces';
import { iCharacterData } from './interfaces/game-player-interfaces';

// ? similar to characterSheetDataStorage loader, should these be the same?
interface iLoaderProps extends iHasId, iHasDataStorageFactory, iHasParentPath {}

export interface iGameProps extends iLoaderProps {
  gameDataStorage: iGameDataStorage;

  // initialCharacterData: iCharacterData[];
  // initialData: iGameData;
}

export default class GameController implements iGameController {
  /** Existing singleton instances of this class */
  protected static instances: Map<string, GameController> = new Map<
    string,
    GameController
  >();

  readonly id: string;

  #dataStorageFactory: iDataStorageFactory;
  #gameDataStorage: iGameDataStorage;
  path: string;

  private constructor({
    id,
    dataStorageFactory,
    gameDataStorage,
    parentPath,
  }: iGameProps) {
    this.id = id;
    this.path = createPath(parentPath, id);

    this.#dataStorageFactory = dataStorageFactory;
    this.#gameDataStorage = gameDataStorage;

    /*
    this.gameMasters = new Set(initialData.gameMasters);

    this.characters = new Map(
      initialCharacterData.map((character) => [character.id, character])
    );
    */
  }

  static defaultData(id: string): iGameData {
    return {
      id,
      description: "",
      gameMasters: [],
    };
  }

  /** Loads a game instance **/
  static async load(props: iLoaderProps): Promise<GameController> {
    const { dataStorageFactory, id } = props;

    dataStorageFactory.assertIdIsValid(id);

    const preExistingInstance = GameController.instances.get(id);

    // if an instance has already been created with this id then use that instance
    if (preExistingInstance) return preExistingInstance;

    try {
      const gameDataStorage = dataStorageFactory.newGameDataStorage(props);

      // todo find a better way to do this
      await gameDataStorage.assertDataExistsOnDataStorage();

      /*
      const initialData = await gameDataStorage.getData();

      const initialCharacterData = await gameDataStorage.getCharacters();
      */

      return new GameController({
        ...props,
        gameDataStorage,
        dataStorageFactory,
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

  data(): Promise<iGameData> {
    return this.#gameDataStorage.getData();
  }

  async getCharacterData(): Promise<Map<string, iCharacterData>> {
    const data = await this.#gameDataStorage.getCharacterData();

    return new Map(
      data.map((characterData) => [characterData.id, characterData])
    );
  }

  async loadCharacterSheets(): Promise<Map<UID, iCharacterSheet>> {
    const characterSheetPromises = (
      await this.#gameDataStorage.getCharacterData()
    ).map(({ id }) =>
      CharacterSheet.load({
        dataStorageFactory: this.#dataStorageFactory,
        id,
        parentPath: this.path,
      })
    );

    const characterSheets = await Promise.all(characterSheetPromises);

    // no character sheets defined
    if (!characterSheets || !characterSheets.length) return new Map();

    // return character sheet instances
    return new Map(
      Array.from(characterSheets.values()).map((characterSheet) => [
        characterSheet.id,
        characterSheet,
      ])
    );
  }

  setDescription(description: string): Promise<void> {
    return this.#gameDataStorage.setDescription(description);
  }
}

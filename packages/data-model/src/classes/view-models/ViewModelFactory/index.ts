import { auth, UID } from '@quirk-a-bot/common';

import { iGameModelWriter, ModelFactory, ModelUtils } from '../../data-models/interfaces';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { iUserViewModel } from '../../user/interfaces';
import { iCharacterSheetViewModel } from '../CharacterSheetViewModel/interfaces';
import GameViewModel from '../GameViewModel';
import { iGameViewModel } from '../GameViewModel/interfaces';
import { iViewModelFactory } from './interfaces';

export default class ViewModelFactory implements iViewModelFactory {
  #modelFactory: ModelFactory;
  #modelUtils: ModelUtils;

  constructor(modelFactory: ModelFactory) {
    this.#modelFactory = modelFactory;
    this.#modelUtils = modelFactory.utils;
  }

  async getCharacterSheetViewModel(
    gameId: string,
    characterId: string
  ): Promise<iCharacterSheetViewModel> {}

  async getGameViewModel(gameId: string): Promise<iGameViewModel> {
    const currentUserId = this.getCurrentUserId();

    if (!currentUserId)
      throw Error(
        `Cannot produce game view model because no user is signed in`
      );

    const gameData = await this.#modelUtils.getGameData(gameId);

    if (!gameData)
      throw Error(
        `Game with id ${gameId} doesn't exist, create it before requesting view model`
      );

    const userIsGameAdmin = this.isGameAdmin(gameData, currentUserId);
    const userIsGameCharacter = this.isGameCharacter(gameData, currentUserId);

    if (!userIsGameAdmin && !userIsGameCharacter)
      throw Error(
        `Current user (${currentUserId}) is not part of game ${gameId}, cannot provide GameViewModel`
      );

    const modelReader = this.#modelFactory.getGameModelReader(gameId);

    let modelWriter: iGameModelWriter | undefined;

    if (userIsGameAdmin)
      modelWriter = this.#modelFactory.getGameModelWriter(gameId);
    else
      console.warn(
        `Current user (${currentUserId}) is not an admin of game ${gameId}, denying write access`
      );

    return new GameViewModel({ id: gameId, modelReader, modelWriter });
  }

  async getUserViewModel(): Promise<iUserViewModel> {
    throw new Error("Method not implemented.");
  }

  private getCurrentUserId(): UID | undefined {
    return auth.currentUser?.uid;
  }

  private isGameAdmin(game: iGameData, characterId: UID): boolean {
    return !!game.users[characterId]?.isAdmin;
  }

  private isGameCharacter(game: iGameData, characterId: UID): boolean {
    return !!game.users[characterId]?.isCharacter;
  }

  private isGameUser(game: iGameData, characterId: UID): boolean {
    return (
      this.isGameCharacter(game, characterId) ||
      this.isGameAdmin(game, characterId)
    );
  }
}

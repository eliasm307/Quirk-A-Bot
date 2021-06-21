import { auth, UID } from '@quirk-a-bot/common';

import {
  iCharacterSheetModelWriter, iGameModelWriter, ModelFactory, ModelUtils,
} from '../../data-models/interfaces';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { iUserViewModelOLD } from '../../user/interfaces';
import CharacterSheetViewModel from '../CharacterSheetViewModel';
import { iCharacterSheetViewModel } from '../CharacterSheetViewModel/interfaces';
import GameViewModel from '../GameViewModel';
import { iGameViewModel } from '../GameViewModel/interfaces';
import UserViewModel from '../UserViewModel';
import { iUserViewModel } from '../UserViewModel/interfaces';
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
  ): Promise<iCharacterSheetViewModel> {
    const currentUserId = this.getCurrentUserId();

    if (!currentUserId)
      throw Error(
        `Cannot produce character sheet view model because no user is signed in`
      );

    const { userIsGameAdmin, userIsGameCharacter } =
      await this.getUserGameRoles(gameId, currentUserId);

    if (!userIsGameAdmin && !userIsGameCharacter)
      throw Error(
        `Current user (${currentUserId}) is not part of game ${gameId}, cannot provide a character sheet view model from this game`
      );

    const modelReader = this.#modelFactory.getCharacterSheetModelReader(
      gameId,
      characterId
    );

    let modelWriter: iCharacterSheetModelWriter | undefined;
    if (userIsGameAdmin || characterId === currentUserId)
      modelWriter = this.#modelFactory.getCharacterSheetModelWriter(
        gameId,
        characterId
      );
    else
      console.warn(
        `Current user (${currentUserId}) is not the character sheet owner or a game admin, denying write access`
      );

    return CharacterSheetViewModel.load({
      id: characterId,
      modelReader,
      modelWriter,
    });
  }

  async getGameViewModel(gameId: string): Promise<iGameViewModel> {
    const currentUserId = this.getCurrentUserId();

    if (!currentUserId)
      throw Error(
        `Cannot produce game view model because no user is signed in`
      );

    const { userIsGameAdmin, userIsGameCharacter } =
      await this.getUserGameRoles(gameId, currentUserId);

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
    // todo expand this to allow getting view models of other users
    return new UserViewModel();
  }

  private getCurrentUserId(): UID | undefined {
    return auth.currentUser?.uid;
  }

  private async getUserGameRoles(
    gameId: string,
    userId: string
  ): Promise<{ userIsGameAdmin: boolean; userIsGameCharacter: boolean }> {
    const gameData = await this.#modelUtils.getGameData(gameId);

    if (!gameData)
      throw Error(
        `Game with id ${gameId} doesn't exist, create it before requesting view model`
      );

    const userIsGameAdmin = this.isGameAdmin(gameData, userId);
    const userIsGameCharacter = this.isGameCharacter(gameData, userId);

    return { userIsGameAdmin, userIsGameCharacter };
  }

  private isGameAdmin(game: iGameData, characterId: UID): boolean {
    return !!game.users[characterId]?.isAdmin;
  }

  private isGameCharacter(game: iGameData, characterId: UID): boolean {
    return !!game.users[characterId]?.isCharacter;
  }

/*
  private isGameUser(game: iGameData, characterId: UID): boolean {
    return (
      this.isGameCharacter(game, characterId) ||
      this.isGameAdmin(game, characterId)
    );
  }
  */
}

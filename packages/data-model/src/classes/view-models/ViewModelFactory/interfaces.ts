import { GameId, UID } from '@quirk-a-bot/common';

import { iGameViewModelOLD } from '../../game/interfaces/game-interfaces';
import { iUserViewModel } from '../../user/interfaces';
import { iCharacterSheetViewModel } from '../CharacterSheetViewModel/interfaces';
import { iGameViewModel } from '../GameViewModel/interfaces';

/** Produces view model instances with read/write capabilities set based on logged in user */
export interface iViewModelFactory {
  getCharacterSheetViewModel(
    gameId: GameId,
    characterId: UID
  ): Promise<iCharacterSheetViewModel>;
  getGameViewModel(gameId: GameId): Promise<iGameViewModel>;
  getUserViewModel(): Promise<iUserViewModel>;
}

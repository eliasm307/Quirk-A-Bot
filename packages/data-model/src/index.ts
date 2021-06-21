import { auth, GameId } from '@quirk-a-bot/common';

import CharacterSheet from './classes/character-sheet/CharacterSheet-OLD';
import { iGameViewModelOLD } from './classes/game/interfaces/game-interfaces';
import { iUserViewModel } from './classes/user/interfaces';
import UserViewModelOLD from './classes/user/UserViewModelOLD';
import GameViewModel from './classes/view-models/GameViewModel';
import UserViewModel from './classes/view-models/UserViewModel';

// console.warn(__filename, 'init');

// todo define exports which include protection based on the signed in user, ie a user can only access games or character sheets they have access to

// todo refactor code to be organised by domain models

export const getUserViewModel = (): iUserViewModel => {
  if (!auth.currentUser)
    throw Error(
      `Cannot get user view model because no user is signed in, current user is ${typeof auth.currentUser}`
    );

  return new UserViewModel();
};

export const getGameViewModel = async (id: GameId): iGameViewModelOLD => {};

export { CharacterSheet };

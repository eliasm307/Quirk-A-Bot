import { UID, WebURL } from '@quirk-a-bot/common';

import { iStringTrait } from '../../traits/interfaces/trait-interfaces';
import { PlayerStatus } from '../types';

/** Represents user details specific to a game */
export interface iGameCharacterShape {
  /** Id for this users in this particular game, id matches the users auth id */
  id: UID;
  /** Link to any profile image */
  img: WebURL;
  /** How the player would like to be addressed as in this game, defaults to User.name */
  name: any;

/** Status of the player for the game */
  // status: any;
}

/** Represents user details specific to a game */
export interface iGameCharacter extends iGameCharacterShape {
  /** How the player would like to be addressed as in this game, defaults to User.name.
   // todo this should replace name in characterSheet */
  name: iStringTrait<"Status", PlayerStatus>;

/** Status of the player for the game */
  // status: iStringTrait<"Status", PlayerStatus>;
}

// todo not required for now, but will be for tracking game users/players
/** Represents user character details specific to a game */
export interface iGameCharacterData extends iGameCharacterShape {
  /** How the player would like to be addressed as in this game, defaults to User.name */
  name: string;

/** Status of the player for the game */
  // status: PlayerStatus;
}

import { iStringTrait } from 'src/classes/traits/interfaces/trait-interfaces';

import { PlayerStatus } from './types';

/** Represents user details specific to a game */
export interface iGamePlayer extends iGamePlayerShape {
  /** How the player would like to be addressed as in this game, defaults to User.name.
   // todo this should replace name in characterSheet */
  name: iStringTrait<"Status", PlayerStatus>;
  /** Status of the player for the game */
  status: iStringTrait<"Status", PlayerStatus>;
}

/** Represents user details specific to a game */
export interface iGamePlayerData extends iGamePlayerShape {
  /** How the player would like to be addressed as in this game, defaults to User.name */
  name: string;
  /** Status of the player for the game */
  status: PlayerStatus;
}

/** Represents user details specific to a game */
export interface iGamePlayerShape {
  /** Id for this users in this particular game, id matches the users auth id */
  id: string;
  /** Link to any profile image */
  img: string;
  /** How the player would like to be addressed as in this game, defaults to User.name */
  name: any;
  /** Status of the player for the game */
  status: any;
}

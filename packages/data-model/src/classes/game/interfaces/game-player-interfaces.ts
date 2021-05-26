import { UID, WebURL } from '@quirk-a-bot/common';

/** Represents user details specific to a game */
export interface iGameCharacterViewModel {
  // todo implement?
}

// todo not required for now, but will be for tracking game users/players
/** Represents user character details specific to a game */
export interface iCharacterData {
  /** Id for this users in this particular game, id matches the users auth id */
  id: UID;
  /** Link to a profile image for a character in a game */
  img: WebURL;
  /** How the player would like to be addressed as in this game, defaults to User.name */
  name: string;

  /** Status of the player for the game */
  // status: any;
  /** Status of the player for the game */
  // status: PlayerStatus;
}

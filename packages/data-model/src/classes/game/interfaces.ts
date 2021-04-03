import { iHasParentPath } from '../../declarations/interfaces';
import { iCharacterSheet } from '../character-sheet/interfaces/character-sheet-interfaces';

/** Represents a VTM game as viewed by a non-admin player*/
export interface iPlayerGame extends iHasParentPath {
  /** The uri to the last websocket instance created by a discord bot instance // todo implement */
  botWebsocketUri?: string;
  /** The character sheets a game has as a map, with charactersheet id as the key */
  characterSheets: Map<string, iCharacterSheet>;
  /** Optional description of the game */
  description: string;
  /** Unique game id */
  id: string;
}

/** Represents a VTM game as viewed by an admin player */
export interface iAdminGame extends iPlayerGame {
  /** List of players and game masters involved in this game */
  players: iGamePlayerData[];

// todo this should allow adding and removing to firestore
}

/** Game data as saved in Firestore in JSON format */
export interface iGameData extends iCoreGameData {
  /** The ids of character sheets in a game (equivalent to the non-game master player ids), from a sub-collection  */
  characterSheetIds: string[];
  /** List of players and game masters involved in this game, from a sub-collection */
  players: iGamePlayerData[];
}

/** The data contained in the core game data document */
export interface iCoreGameData {
  /** Optional description of the game */
  description: string;
  /** Unique game id */
  id: string;
}

/** Represents user details specific to a game */
export interface iGamePlayerData {
  /** Id for this users in this particular game, id matches the users auth id */
  id: string;
  /** A flag to say if a player is a game master, this grants extra privileges */
  isGameMaster: boolean;
  /** How the player would like to be addressed as in this game, defaults to User.name */
  playerName: string;
}

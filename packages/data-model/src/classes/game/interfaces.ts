import { iCharacterSheet } from '../character-sheet/interfaces/character-sheet-interfaces';

/** Represents a VTM game as viewed by a non-admin player*/
export interface iGame {
	/** The character sheets a game has as a map, with charactersheet id as the key */
	characterSheets: Map<string, iCharacterSheet>;
	/** Optional description of the game */
	description: string;
	id: string;
}

/** Represents a VTM game as viewed by an admin player */
export interface iGameAdmin extends iGame {
	/** List of players and game masters involved in this game */
	players: iGamePlayer[];
}

/** Represents user details specific to a game */
export interface iGamePlayer {
	/** Id for this users in this particular game */
	id: string;
	/** A flag to say if a player is a game master, this grants extra privileges */
	isGameMaster: boolean;
	/** How the player would like to be addressed as in this game, defaults to User.name */
	playerName: string;
}

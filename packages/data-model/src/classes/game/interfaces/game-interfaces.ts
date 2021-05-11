import { GameId, iHasParentPath, UID, WebURL } from '@quirk-a-bot/common';

import { iTraitCollection } from '../../../classes/traits/interfaces/trait-collection-interfaces';
import { iStringTrait } from '../../../classes/traits/interfaces/trait-interfaces';
import { iHasId } from '../../../declarations/interfaces';
import { iCharacterSheet } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iCharacterData } from './game-player-interfaces';

/** Game data including data from sub-collections */
export interface iGameShape {
  /** Unique game id */
  readonly id: string;

  /** Optional description of the game */
  description: string;
  /** The uri to the last websocket instance created by a discord bot instance // todo implement */
  discordBotWebSocketServer?: WebURL;
  /** List of game masters */
  gameMasters: unknown;

  /** List of players involved in this game as characters, from a sub-collection */
  // players: unknown; // todo to be implemented as part of player management system
}

/** Game data as stored in firestore game document */
export interface iGameData extends iGameShape {
  /** Read-only List of players ids of players who are game masters,
   * this is a subset of the players list */
  gameMasters: UID[];

  // players: iGamePlayerData[];
}

/** Represents a VTM game in firestore */
export interface iGame {
  /** Unique game id */
  readonly id: GameId;
  readonly path: string;

  // gameMasters: Set<UID>;
  addCharacter(id: string): Promise<void>;
  data(): Promise<iGameData>;
  /** ids from characters sub collection  */
  getCharacterData(): Promise<Map<UID, iCharacterData>>;
  /** Loads character sheets defined in the game */
  loadCharacterSheets(): Promise<Map<UID, iCharacterSheet>>;
  setDescription(description: string): Promise<void>;

  // players: Map<UID, iGamePlayerData>;

  // todo add game user control functions
  /** Accept a player's request to join a game,
   * initialise their character sheet or re-enable any existing character sheet for this player,
   * then update their status to `Active` */
  // acceptPlayerRequest(playerId: UID): Promise<boolean>;
  /** Reject a player's request to join a game and update their status to `Rejected` */
  // rejectPlayerRequest(playerId: UID, reason?: string): Promise<boolean>;
  /** Remove a player from a game,
   * mark their character sheet as hidden,
   * then update their status to `Removed` */
  // removePlayer(playerId: UID, reason?: string): Promise<boolean>;
}

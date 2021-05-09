import { UID } from '@quirk-a-bot/common';

import { iTraitCollection } from '../../../classes/traits/interfaces/trait-collection-interfaces';
import { iStringTrait } from '../../../classes/traits/interfaces/trait-interfaces';
import { iCharacterSheet } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iGamePlayerData } from './game-player-interfaces';

/** Game data including data from sub-collections */
export interface iGameShape {
  /** Unique game id */
  readonly id: string;

  /** The uri to the last websocket instance created by a discord bot instance // todo implement */
  botWebsocketUri?: string;
  /** The core data of a character document, which a sub-collection for character sheet traits etc (fetched separately)  */
  characters: UID[];
  /** Optional description of the game */
  description: any;
  /** List of players who are game masters, this is a subset of the players list */
  gameMasters: any;
  /** List of players and game masters involved in this game, from a sub-collection */
  players: iGamePlayerData[];
}

/** Game data including data from sub-collections */
export interface iGameData extends iGameShape {
  description: string;
  /** Read-only List of players ids of players who are game masters,
   * this is a subset of the players list */
  gameMasters: string[];
}

/** Represents a VTM game in firestore */
export interface iGame extends iGameShape {
  /** The character sheets a game has as a map, with charactersheet id as the key */
  characterSheets: Map<string, iCharacterSheet>;
  description: iStringTrait;
  /** List of players who are game masters, this is a subset of the players list,
   * only other game masters have write access to this collection */
  gameMasters: iTraitCollection<string, string>;
  players: iGamePlayerData[];

  /** Accept a player's request to join a game,
   * initialise their character sheet or re-enable any existing character sheet for this player,
   * then update their status to `Active` */
  acceptPlayerRequest(playerId: string): Promise<boolean>;
  /** Reject a player's request to join a game and update their status to `Rejected` */
  rejectPlayerRequest(playerId: string, reason?: string): Promise<boolean>;
  /** Remove a player from a game,
   * mark their character sheet as hidden,
   * then update their status to `Removed` */
  removePlayer(playerId: string, reason?: string): Promise<boolean>;
}

import { FirestoreFieldValue } from 'packages/common/dist/src/FirebaseExports';

import { GameId, UID, WebURL } from '@quirk-a-bot/common';

import { iBaseViewModelOLD } from '../../../declarations/interfaces';
import { iCharacterData } from './game-player-interfaces';

interface GameUserDetails {
  isAdmin?: boolean;
  isCharacter?: boolean;
}

/** Game data as stored in firestore game document */
export interface iGameData {
  /** Unique game id */
  readonly id: string;

  created: string;
  createdBy: UID;
  /** Optional description of the game */
  description: string;
  /** The uri to the last websocket instance created by a discord bot instance // todo implement */
  discordBotWebSocketServer?: WebURL;
  /** List of players involved in this game as characters, from a sub-collection */
  // players: unknown; // todo to be implemented as part of player management system
  /** Read-only List of players ids of players who are game masters,
   * this is a subset of the players list */
  // gameMasterIds: Record<UID, true | FirestoreFieldValue>;
  users: Record<UID, GameUserDetails>;

  // players: iGamePlayerData[];
}

/** Represents a VTM game in firestore */
export interface iGameViewModelOLD extends iBaseViewModelOLD<iGameData> {
  /** Unique game id */
  readonly id: GameId;

  // gameMasters: Set<UID>;
  addCharacter(id: UID): Promise<void>;
  /** ids from characters sub collection  */
  getCharactersData(): Promise<Map<UID, iCharacterData>>;
  removeCharacter(id: UID): Promise<void>;

  /** Loads character sheets defined in the game */
  // loadCharacterSheets(): Promise<Map<UID, iCharacterSheet>>;

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

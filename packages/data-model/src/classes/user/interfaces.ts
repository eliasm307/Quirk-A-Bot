import { ChangeHandler, GameId, UID } from '@quirk-a-bot/common';

export interface iHasUid {
  /** UID from Firebase Authentication  */
  uid: string;
}

/** User data as saved in firestore as JSON */
export interface iUserData extends iHasUid {
  /** User name in VTM */
  name: string;
}

/** User object instance */
export interface iUserController {
  /** List of games the user is involved in as a player */
  getMyAdminGameIds: Set<GameId>;
  /** List of games the user is involved in as a player */
  getMyPlayerGameIds: Set<GameId>;

  /** Get current user data */
  data(): Promise<iUserData>;
  onChange(handler: ChangeHandler<iUserData>): void;
  /** Update user data */
  update(updates: Partial<Omit<iUserData, "uid" | "id">>): Promise<void>;
}

/** Defines the participation of a user in a game and provides information on the participation */
export interface iUserGameParticipationData {
  // todo delete this interface
  /** The id of a game */
  gameId: GameId;

/** The id of a user in a particular game */
  // playerId: UID;
}

import { ChangeHandler, GameId, iHasUid } from '@quirk-a-bot/common';

/** User data as saved in firestore as JSON */
export interface iUserData extends iHasUid {
  /** List of games the user is involved in as an admin */
  adminGames: GameId[];
  /** User name in VTM */
  name: string;
  /** List of games the user is involved in as a player */
  playerGames: GameId[];
}

/** User object instance */
export interface iUserController {
  /** List of games the user is involved in as a player */
  // getMyAdminGameIds: Set<GameId>;
  /** List of games the user is involved in as a player */
  // getMyPlayerGameIds: Set<GameId>;

  /** Get current user data */
  data(): Promise<iUserData>;
  onChange(handler: ChangeHandler<iUserData>): void;
  /** Update user data */
  update(updates: Partial<Omit<iUserData, "uid" | "id">>): Promise<void>;
}

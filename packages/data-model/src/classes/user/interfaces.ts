import { GameId, iHasUid, WebURL } from '@quirk-a-bot/common';

import { iBaseViewModel } from '../../declarations/interfaces';

/** User data as saved in firestore as JSON,
 * *NOTE* matches editable fields from Firebase Auth */
export interface iUserData extends iHasUid {
  /** User name in VTM */
  displayName: string;
  // todo save related game ids to user profile to reduce complex queries required
  /** List of games the user is involved in as an admin */
  // adminGames: GameId[];
  /** Link to a profile image for a user */
  photoURL: WebURL;

/** List of games the user is involved in as a player */
  // playerGames: GameId[];
}

export interface iUserViewModel extends iBaseViewModel<iUserData> {
  /** List of games the user is involved in as a player */
  // getMyAdminGameIds: Set<GameId>;
  /** List of games the user is involved in as a player */
  // getMyPlayerGameIds: Set<GameId>;
}

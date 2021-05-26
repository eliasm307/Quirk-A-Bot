import { GameId, iHasUid, WebURL } from '@quirk-a-bot/common';

import { iBaseViewModel } from '../../declarations/interfaces';

/** User data as saved in firestore as JSON */
export interface iUserData extends iHasUid {
  // todo save related game ids to user profile to reduce complex queries required
  /** List of games the user is involved in as an admin */
  // adminGames: GameId[];
  /** Link to a profile image for a user */
  img: WebURL;
  /** User name in VTM */
  name: string;

/** List of games the user is involved in as a player */
  // playerGames: GameId[];
}

export interface iUserViewModel extends iBaseViewModel<iUserData> {
  /** List of games the user is involved in as a player */
  // getMyAdminGameIds: Set<GameId>;
  /** List of games the user is involved in as a player */
  // getMyPlayerGameIds: Set<GameId>;
}

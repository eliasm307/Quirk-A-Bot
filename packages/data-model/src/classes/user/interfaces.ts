export interface iHasUid {
  /** UID from Firebase Authentication  */
  uid: string;
}

/** Base shape of a user */
export interface iUserShape {
  /** List of games the user is involved in */
  myGames: unknown;
  /** User name in VTM */
  name: string;
}

/** User object instance */
export interface iUser extends iUserShape {
  /** List of games the user is involved in, as a map using gameId as key */
  myGames: Map<string, iUserGameParticipationData>;
}

/** User data as saved in firestore as JSON */
export interface iUserData extends iUserShape, iHasUid {
  /** List of games the user is involved in, as an array */
  myGames: iUserGameParticipationData[];

  // NOTE uid is only required to identify users in Firestore
}

/** Defines the participation of a user in a game and provides information on the participation */
export interface iUserGameParticipationData {
  /** The id of a game */
  gameId: string;
  /** The id of a user in a particular game */
  playerId: string;
}

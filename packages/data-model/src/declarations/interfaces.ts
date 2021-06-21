import {
  AttributeName, ClanName, CoreNumberTraitName, CoreStringTraitName, DisciplineName, Firestore,
  iHasUid, SkillName, TraitNameUnionOrString, TraitValueTypeUnion, UID, WebURL,
} from '@quirk-a-bot/common';

// todo move this to common

export interface GameUserDetails {
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

// todo not required for now, but will be for tracking game users/players
/** Represents user character details specific to a game */
export interface iCharacterData {
  /** Id for this users in this particular game, id matches the users auth id */
  id: UID;
  /** Link to a profile image for a character in a game */
  img?: WebURL;
  /** How the player would like to be addressed as in this game, defaults to User.name */
  name: string;

/** Status of the player for the game */
  // status: any;
  /** Status of the player for the game */
  // status: PlayerStatus;
}

/** Describes the shape of trait data with generic types */
export interface iBaseTraitData<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion
> {
  name: N;
  value: V;
}

export interface iNumberTraitData<
  N extends TraitNameUnionOrString = TraitNameUnionOrString
> extends iBaseTraitData<N, number> {}

export interface iStringTraitData<
  N extends TraitNameUnionOrString,
  V extends string
> extends iBaseTraitData<N, V> {}

// -------------------------------------------------------
// SPECIFIC TRAIT DATA TYPES
// NOTE Data should only contain user defined data

export interface iAttributeData extends iNumberTraitData<AttributeName> {}
export interface iTouchStoneOrConvictionData
  extends iStringTraitData<string, string> {}
export interface iSkillData extends iNumberTraitData<SkillName> {}
export interface iDisciplineData extends iNumberTraitData<DisciplineName> {
  // todo add "specialisation" / sub types?
}
export interface iCoreStringTraitData<V extends string = string>
  extends iStringTraitData<CoreStringTraitName, V> {}
export interface iCoreNumberTraitData
  extends iNumberTraitData<CoreNumberTraitName> {}

/** The shape of character sheet as plain JSON data, with top level trait collections */
export interface iCharacterSheetData extends Omit<iCharacterData, "name"> {
  attributes: Partial<Record<AttributeName, iAttributeData>>;
  // ? should core traits be mandatory?
  coreNumberTraits: Partial<Record<CoreNumberTraitName, iCoreNumberTraitData>>;
  coreStringTraits: Partial<
    Record<CoreStringTraitName, iCoreStringTraitData>
  > & {
    Clan?: iCoreStringTraitData<ClanName>;
  };
  disciplines: Partial<Record<DisciplineName, iDisciplineData>>;
  /*
  health: iCoreNumberTraitData;
  humanity: iCoreNumberTraitData;
  hunger: iCoreNumberTraitData;
  name: iCoreStringTraitData<string>;
  sire: iCoreStringTraitData<string>;
  willpower: iCoreNumberTraitData;
  bloodPotency: iCoreNumberTraitData;
  */
  skills: Partial<Record<SkillName, iSkillData>>;
  touchstonesAndConvictions: Partial<
    Record<string, iTouchStoneOrConvictionData>
  >;
}

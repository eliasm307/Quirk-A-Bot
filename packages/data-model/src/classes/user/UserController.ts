import { UID } from '@quirk-a-bot/common/sr';

import { DEFAULT_USER_NAME, USER_COLLECTION_NAME } from '../../../../common/src/constants';
import { iHasFirestore } from '../../declarations/interfaces';
import isUserData from '../../utils/type-predicates/isUserData';
import {
  iHasUid, iPlayerGameParticipationData, iUserController as iUserController, iUserData,
} from './interfaces';

interface iLoadProps
  extends iHasFirestore,
    Partial<Omit<iUserData, "uid">>,
    iHasUid {}

export default class UserController implements iUserController {
  // todo this should be a proxy over a base editable object?
  readonly getMyGames: Map<string, iPlayerGameParticipationData>;
  readonly name: string;

  private constructor({ getMyGames: myGames, name, uid }: iUserData) {
    // todo there should be a User editor class that allows user data to be modified
    this.name = name;

    const userGamesEntries = myGames.map(
      (game) => [game.gameId, game] as const
    );

    this.getMyGames = new Map<string, iPlayerGameParticipationData>(
      userGamesEntries
    );
  }

  /** Loads an existing user */
  static async load(props: iLoadProps): Promise<UserController | void> {
    const { uid, firestore, name } = props;
    try {
      const userDoc = await firestore
        .collection(USER_COLLECTION_NAME)
        .doc(uid)
        .get();

      if (!userDoc || !userDoc.exists) {
        throw Error(
          `Could not load user with uid "${uid}", no data found on this user, need to sign up first`
        );
      }

      const userData = userDoc.data();

      if (!isUserData(userData)) {
        return console.error(
          `Could not load user with uid "${uid}", data was invalid format`
        );
      }

      return new UserController(userData);
    } catch (error) {
      return console.error({ error });
    }
  }

  protected static async newUser({
    uid,
    firestore,
    data,
  }: iLoadProps & {
    data: Partial<Omit<iUserData, "uid">>;
  }): Promise<UserController> {
    const userData: iUserData = { uid, name: DEFAULT_USER_NAME, ...data };

    try {
      // init user on firestore
      await firestore.collection(USER_COLLECTION_NAME).doc(uid).set(userData);
    } catch (error) {
      console.error({ error });
      throw Error(`Error initialising user with uid ${uid}`);
    }
    return new UserController(userData);
  }

  /*
  protected static newUser({
    uid,
    name = DEFAULT_USER_NAME,
  }: Partial<iUserData> & iHasUid): iUserData {
    return {
      uid,
      name,
    };
  }
  */
}

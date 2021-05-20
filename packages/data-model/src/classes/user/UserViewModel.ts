import { ChangeHandler, iHasUid } from '@quirk-a-bot/common';

import { USER_COLLECTION_NAME } from '../../../../common/src/constants';
import { iHasFirestore } from '../../declarations/interfaces';
import isUserData from '../../utils/type-predicates/isUserData';
import { iUserController as iUserViewModel, iUserData } from './interfaces';
import defaultUserData from './utils/defaultUserData';

interface iLoadProps
  extends iHasFirestore,
    Partial<Omit<iUserData, "uid">>,
    iHasUid {}

export default class UserViewModel implements iUserViewModel {
  // todo this should be a proxy over a base editable object?
  // readonly getMyGames: Map<string, iPlayerGameParticipationData>;
  private constructor({ name }: iUserData) {
    // todo there should be a User editor class that allows user data to be modified
    /*
    const userGamesEntries = myGames.map(
      (game) => [game.gameId, game] as const
    );

    this.getMyGames = new Map<string, iPlayerGameParticipationData>(
      userGamesEntries
    );
    */
  }

  /** Loads an existing user */
  static async load(props: iLoadProps): Promise<UserViewModel | void> {
    const { uid, firestore, name } = props;
    try {
      const userDoc = await firestore
        .collection(USER_COLLECTION_NAME)
        .doc(uid)
        .get();

      if (!userDoc || !userDoc.exists)
        throw Error(
          `Could not load user with uid "${uid}", no data found on this user, need to sign up first`
        );

      const userData = userDoc.data();

      if (!isUserData(userData))
        throw Error(
          `Could not load user with uid "${uid}", data was invalid format`
        );

      return new UserViewModel(userData);
    } catch (error) {
      return console.error({ error });
    }
  }

  data(): Promise<iUserData> {}

  onChange(handler: ChangeHandler<iUserData>): void {}

  update(updates: Partial<Omit<iUserData, "uid" | "id">>): Promise<void> {}

  // todo this shouldnt be part of the UserViewModel, users can only be created from signing up
  protected static async newUser({
    uid,
    firestore,
    data,
  }: iLoadProps & {
    data: Partial<Omit<iUserData, "uid">>;
  }): Promise<UserViewModel> {
    const userData: iUserData = {
      ...defaultUserData(uid),
      ...data,
    };

    try {
      // init user on firestore
      await firestore.collection(USER_COLLECTION_NAME).doc(uid).set(userData);
    } catch (error) {
      console.error({ error });
      throw Error(`Error initialising user with uid ${uid}`);
    }
    return new UserViewModel(userData);
  }
}

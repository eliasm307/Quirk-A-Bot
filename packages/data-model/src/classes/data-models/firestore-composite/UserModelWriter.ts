import { auth } from '@quirk-a-bot/common';

import { iUserData } from '../../user/interfaces';
import { BaseModelWriter } from '../interfaces/interfaces';

export default class UserFirestoreCompositeModelWriter
  implements BaseModelWriter<iUserData>
{
  id: string;

  constructor() {
    if (!auth.currentUser)
      throw Error(
        `Cannot update user because no user is signed in, current user is ${typeof auth.currentUser}`
      );

    this.id = auth.currentUser.uid;
  }

  async update(newData: Partial<Omit<iUserData, "id">>): Promise<void> {
    if (!auth.currentUser)
      throw Error(
        `Cannot update user with id ${this.id} because user is not signed in`
      );
    void auth.updateCurrentUser({ ...auth.currentUser, ...newData });
  }
}

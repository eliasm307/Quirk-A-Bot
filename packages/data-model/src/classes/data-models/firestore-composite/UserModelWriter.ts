import { auth, iHasParentPath } from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { iUserData } from '../../user/interfaces';
import { BaseModelWriter } from '../interfaces/interfaces';
import AbstractModelWriter from './AbstractModelWriter';

interface Props extends iHasId {}

export default class UserFirestoreCompositeModelWriter
  implements BaseModelWriter<iUserData>
{
  id: string;

  constructor({ id }: Props) {
    this.id = id;
  }

  update(newData: Partial<Omit<iGameData, "id">>): void {
    throw new Error("Method not implemented.");
  }
}

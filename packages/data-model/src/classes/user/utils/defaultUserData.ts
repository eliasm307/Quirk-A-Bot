import { DEFAULT_USER_NAME, UID } from '@quirk-a-bot/common';

import { iGameData } from '../../game/interfaces/game-interfaces';
import { iUserData } from '../interfaces';

export default function defaultUserData(uid: UID): iUserData {
  return { uid, name: DEFAULT_USER_NAME, adminGames: [], playerGames: [] };
}

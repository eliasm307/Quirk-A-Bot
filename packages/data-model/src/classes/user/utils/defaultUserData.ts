import { DEFAULT_CHARACTER_IMAGE_URL, DEFAULT_USER_NAME, UID } from '@quirk-a-bot/common';

import { iUserData } from '../interfaces';

export default function defaultUserData(uid: UID): iUserData {
  return {
    id: uid,
    displayName: DEFAULT_USER_NAME,
    photoURL: DEFAULT_CHARACTER_IMAGE_URL,
  };
}

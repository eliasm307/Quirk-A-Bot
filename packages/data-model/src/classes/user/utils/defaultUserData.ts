import { DEFAULT_CHARACTER_IMAGE_URL, DEFAULT_USER_NAME, UID } from '@quirk-a-bot/common';

import { iUserData } from '../interfaces';

export default function defaultUserData(uid: UID): iUserData {
  return { uid, name: DEFAULT_USER_NAME, img: DEFAULT_CHARACTER_IMAGE_URL };
}

import { DEFAULT_CHARACTER_IMAGE_URL, DEFAULT_CHARACTER_NAME, UID } from '@quirk-a-bot/common';

export default function defaultCharacterData(id: UID) {
  return {
    id,
    img: DEFAULT_CHARACTER_IMAGE_URL,
    name: DEFAULT_CHARACTER_NAME,
  };
}

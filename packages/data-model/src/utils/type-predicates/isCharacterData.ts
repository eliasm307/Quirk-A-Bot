import { isNonEmptyString, isString } from '@quirk-a-bot/common';

import { iCharacterData } from '../../classes/game/interfaces/game-player-interfaces';

export default function isCharacterData(data: unknown): data is iCharacterData {
  if (typeof data !== "object") return false;

  const { id, img, name } = data as iCharacterData;

  // make sure all properties are accounted for ie if properties are missing, ts will complain about the following return
  ((): iCharacterData => ({ id, img, name }))();

  const hasId = isNonEmptyString(id);
  const hasName = isNonEmptyString(name);
  const hasImg = isString(img);

  return hasId && hasImg && hasName;
}

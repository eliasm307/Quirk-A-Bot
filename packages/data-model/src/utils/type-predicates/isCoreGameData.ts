import { isNonEmptyString, isString } from '@quirk-a-bot/common';

import { iGameData, iGameShape } from '../../classes/game/interfaces/game-interfaces';

export default function isCoreGameData(data: unknown): data is iGameData {
  if (typeof data !== "object") return false;

  const { description, id, gameMasters } = data as iGameData;

  // to check if all required properties are defined
  ((): iGameData => ({ description, id, gameMasters }))();

  const hasId = isNonEmptyString(id); // id must be non-empty
  const hasDescription = isString(description);
  const hasGameMasters = Array.isArray(gameMasters);

  return (
    (hasId && hasDescription && hasGameMasters) ||
    console.error(__filename, `Data is not core game data`, { data }) ||
    false
  );
}

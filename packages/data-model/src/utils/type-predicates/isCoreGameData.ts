import { isNonEmptyString, isString, newIsArrayPredicate } from '@quirk-a-bot/common';

import { iGameData } from '../../classes/game/interfaces/game-interfaces';

export default function isCoreGameData(data: unknown): data is iGameData {
  if (typeof data !== "object") return false;

  const { description, id, gameMasters, characterIds } = data as iGameData;

  // to check if all required properties are defined
  ((): iGameData => ({ description, id, gameMasters, characterIds }))();

  const hasId = isNonEmptyString(id); // id must be non-empty
  const hasDescription = isString(description);
  const hasGameMasters = newIsArrayPredicate(isString)(gameMasters);
  const hasCharacterIds = newIsArrayPredicate(isString)(characterIds);

  return (
    (hasId && hasDescription && hasGameMasters && hasCharacterIds) ||
    console.error(__filename, `Data is not core game data`, { data }) ||
    false
  );
}

import { isNonEmptyString } from '@quirk-a-bot/common';

import { iUserData } from '../../classes/user/interfaces';

// todo test
export default function isUserData(data: unknown): data is iUserData {
  if (typeof data !== "object") return false;
  if (!data) return false;

  // destructure expected properties
  const { name, uid, img } = data as iUserData;

  // for ts to check all properties accounted for
  ((): iUserData => ({ name, uid, img }))();

  const hasCorrectNumberOfProperties = Object.keys(data).length !== 3;
  if (!hasCorrectNumberOfProperties) return false;

  // verify expected properties exist in the correct format
  const hasUid = uid && typeof uid === "string";
  const hasName = name && typeof name === "string";
  // const hasPlayerGamesArray = playerGames && Array.isArray(playerGames);
  // const hasAdminGamesArray = adminGames && Array.isArray(adminGames);

  // check the format of each item in the games array
  /*
  for (const game of [...playerGames, ...adminGames]) {
    if (!isNonEmptyString(game)) return false;
  }
  */

  return (hasUid && hasName) as boolean;
}

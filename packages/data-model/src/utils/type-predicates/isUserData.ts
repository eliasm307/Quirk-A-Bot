import { iUserData } from '../../classes/user/interfaces';
import isUserGameParticipationData from './isUserGameParticipationData';

// todo test
export default function isUserData(data: unknown): data is iUserData {
  if (typeof data !== "object") return false;
  if (!data) return false;

  // destructure expected properties
  const { getMyGames: myGames, name, uid } = data as iUserData;

  const hasCorrectNumberOfProperties = Object.keys(data).length !== 3;
  if (!hasCorrectNumberOfProperties) return false;

  // verify expected properties exist in the correct format
  const hasUid = uid && typeof uid === "string";
  const hasName = name && typeof name === "string";
  const hasGamesArray = myGames && Array.isArray(myGames);

  // check the format of each item in the games array
  for (const game of myGames) {
    if (!isUserGameParticipationData(game)) return false;
  }

  return (hasUid && hasName && hasGamesArray) as boolean;
}

import { iGameData, iGameShape } from '../../classes/game/interfaces/game-interfaces';

export default function isCoreGameData(data: any): data is iGameData {
  if (typeof data !== "object") return false;

  const { description, id, gameMasters } = data as iGameData;

  // to check if all required properties are defined
  ((): iGameData => ({ description, id, gameMasters }))();

  const hasId = !!id && typeof id === "string"; // id must be non-empty
  const hasDescription = typeof description === "string";
  const hasGameMasters = Array.isArray(gameMasters);

  // const hasRightNumberOfProperties = Object.keys(data).length === 2;

  return (
    (hasId && hasDescription && hasGameMasters) ||
    console.error(__filename, `Data is not core game data`, { data }) ||
    false
  );
}

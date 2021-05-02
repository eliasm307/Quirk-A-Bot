import { iGameShape } from '../../classes/game/interfaces/game-interfaces';

export default function isCoreGameData(data: any): data is iGameShape {
  if (typeof data !== "object") return false;

  const { description, id } = data as iGameShape;

  // todo add other fields

  const hasId = !!id && typeof id === "string"; // id must be non-empty
  const hasDescription = typeof description === "string";

  const hasRightNumberOfProperties = Object.keys(data).length === 2;

  return (
    (hasId && hasDescription && hasRightNumberOfProperties) ||
    console.error(__filename, `Data is not core game data`, { data }) ||
    false
  );
}

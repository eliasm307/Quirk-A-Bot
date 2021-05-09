import { iCharacterData } from '../../classes/game/interfaces/game-player-interfaces';

export default function isGamePlayerData(
  data: unknown
): data is iCharacterData {
  if (typeof data !== "object") return false;
  if (!data) return false;

  const { id } = data as iCharacterData;

  const hasId = typeof id === "string";
  // const hasIsGameMaster = typeof isGameMaster === "boolean";
  // const hasPlayerName = typeof playerName === "string";

  const hasRightNumberOfProperties = Object.keys(data).length === 3;

  return (
    (hasId && hasRightNumberOfProperties) ||
    console.error(__filename, `Data is not GamePlayerData`, { data }) ||
    false
  );
}

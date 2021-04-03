import { iGamePlayerData } from '../../classes/game/interfaces';

export default function isGamePlayerData(data: any): data is iGamePlayerData {
  if (typeof data !== "object") return false;

  const { id, isGameMaster, playerName } = data as iGamePlayerData;

  const hasId = typeof id === "string";
  const hasIsGameMaster = typeof isGameMaster === "boolean";
  const hasPlayerName = typeof playerName === "string";

  const hasRightNumberOfProperties = Object.keys(data).length === 3;

  return (
    (hasId && hasIsGameMaster && hasPlayerName && hasRightNumberOfProperties) ||
    console.error(__filename, `Data is not GamePlayerData`, { data }) ||
    false
  );
}

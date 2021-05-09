import { iGamePlayerData } from '../../classes/game/interfaces/game-player-interfaces';

export default function isGamePlayerData(data: any): data is iGamePlayerData {
  if (typeof data !== "object") return false;

  const { id } = data as iGamePlayerData;

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

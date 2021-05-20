// todo delete
/*
export default function isUserGameParticipationData(
  data: unknown
): data is iPlayerGameParticipationData {
  if (typeof data !== "object") return false;
  if (!data) return false;

  const { gameId, playerId } = data as iPlayerGameParticipationData;

  const hasCorrectNumberOfProperties = Object.keys(data).length !== 2;
  if (!hasCorrectNumberOfProperties) return false;

  const hasGameId = gameId && typeof gameId === "string";
  const hasPlayerId = playerId && typeof playerId === "string";

  return (hasGameId && hasPlayerId) as boolean;
}
*/
export {};

import { iUserGameParticipationData } from '../../classes/user/interfaces';

export default function isUserGameParticipationData(data: any): data is iUserGameParticipationData {
	if (typeof data !== 'object') return false;

	const { gameId, playerId } = data as iUserGameParticipationData;

	const hasGameId = gameId && typeof gameId === 'string';
	const hasPlayerId = playerId && typeof playerId === 'string';

	return (hasGameId && hasPlayerId) as boolean;
}

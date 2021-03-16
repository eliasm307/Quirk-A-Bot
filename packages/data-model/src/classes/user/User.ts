import { USER_COLLECTION_NAME } from '../../constants';
import { iHasFirestore } from '../data-storage/interfaces/data-storage-interfaces';
import { iUser, iUserData, iUserGameParticipationData } from './interfaces';

interface iLoadProps extends iHasFirestore {
	uid: string;
}
export default class User implements iUser {
	myGames: Map<string, iUserGameParticipationData>;
	name: string;

	private constructor({ myGames, name, uid }: iUserData) {
		this.name = name;

		const userGamesEntries = myGames.map(game => [game.gameId, game] as const);
		this.myGames = new Map<string, iUserGameParticipationData>(userGamesEntries);
	}

	static async load({ uid, firestore }: iLoadProps): Promise<User | null> {
		try {
			const userDoc = await firestore.collection(USER_COLLECTION_NAME).doc(uid).get();

			const userData = userDoc.data();

			return new User();
		} catch (error) {
			console.error({ error });
			return null;
		}
	}
}

import { DEFAULT_USER_NAME, USER_COLLECTION_NAME } from '../../constants';
import isUserData from '../../utils/type-predicates/isUserData';
import { iHasFirestore } from '../data-storage/interfaces/data-storage-interfaces';
import { iUser, iUserData, iUserGameParticipationData } from './interfaces';

interface iLoadProps extends iHasFirestore {
	uid: string;
}
export default class UserViewer implements iUser {
	// todo this should be a proxy over a base editable object?
	readonly myGames: Map<string, iUserGameParticipationData>;
	readonly name: string;

	private constructor({ myGames, name, uid }: iUserData) {
		// todo there should be a User editor class that allows user data to be modified
		this.name = name;

		const userGamesEntries = myGames.map(game => [game.gameId, game] as const);
		this.myGames = new Map<string, iUserGameParticipationData>(userGamesEntries);
	}

	static async load(props: iLoadProps): Promise<UserViewer | void> {
		const { uid, firestore } = props;
		try {
			const userDoc = await firestore.collection(USER_COLLECTION_NAME).doc(uid).get();

			if (!userDoc || !userDoc.exists) {
				/*
				// ? should this return something special to indicate that sign up process should be run?
				return console.error(
					`Could not load user with uid "${uid}", no data found on this user, need to sign up first`
				); */
				return UserViewer.initNewUser(props);
			}
			const userData = userDoc.data();
			if (!isUserData(userData)) {
				return console.error(`Could not load user with uid "${uid}", data was invalid format`);
			}

			return new UserViewer(userData);
		} catch (error) {
			return console.error({ error });
		}
	}

	protected static async initNewUser({ uid, firestore }: iLoadProps): Promise<UserViewer> {
		const userData = UserViewer.newUserData(uid);

		try {
			// init user on firestore
			await firestore.collection(USER_COLLECTION_NAME).doc(uid).set(userData);
		} catch (error) {
			console.error({ error });
			throw Error(`Error initialising user with uid ${uid}`);
		}
		return new UserViewer(userData);
	}

	protected static newUserData(uid: string): iUserData {
		return {
			uid,
			name: DEFAULT_USER_NAME, // ? should this require a name to be user defined?
			myGames: [],
		};
	}
}

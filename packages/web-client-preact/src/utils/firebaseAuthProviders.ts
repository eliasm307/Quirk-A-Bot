import firebase, { auth } from '@quirk-a-bot/firebase-utils';

export const signInWithGoogle = () => {
	const provider = new firebase.auth.GoogleAuthProvider();
	auth.signInWithPopup(provider);
};

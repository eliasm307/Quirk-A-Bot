import firebase, { auth } from '@quirk-a-bot/firebase-utils';

export const signInWithGoogle = () => {
	const provider = new firebase.auth.GoogleAuthProvider();
	auth.signInWithPopup(provider);
};

// todo set this up
export const signInWithEmailPassword = () => {
	const provider = new firebase.auth.EmailAuthProvider();
	auth.signInWithPopup(provider);
};

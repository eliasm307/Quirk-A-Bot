import { auth, EmailAuthProvider, GoogleAuthProvider } from '@quirk-a-bot/firebase-utils';

export const signInWithGoogle = () => {
	const provider = new GoogleAuthProvider();
	auth.signInWithPopup(provider);
};

// todo set this up
export const signInWithEmailPassword = () => {
	const provider = new EmailAuthProvider();
	auth.signInWithPopup(provider);
};

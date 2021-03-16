import { auth, EmailAuthProvider, GoogleAuthProvider } from '@quirk-a-bot/firebase-utils';

export const signInWithGoogle = async () => {
	const provider = new GoogleAuthProvider();
	try {
		const cred = await auth.signInWithPopup(provider);
		console.log('Signed in successfully', { cred });
	} catch (error) {
		console.error({ error });
	}
};

// todo set this up
export const signInWithEmailPassword = () => {
	const provider = new EmailAuthProvider();
	auth.signInWithPopup(provider);
};

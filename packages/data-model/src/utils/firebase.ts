// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from 'firebase/app';
import dotenv from 'dotenv';

// Add the Firebase services that you want to use
import 'firebase/auth';
import 'firebase/firestore';
import urlExistSync from 'url-exist-sync';

// load dotenv entries
dotenv.config();

// destructure required entries
const {
	FIREBASE_API_KEY,
	FIREBASE_AUTH_DOMAIN,
	FIREBASE_DATABASE_URL,
	FIREBASE_PROJECT_ID,
	FIREBASE_STORAGE_BUCKET,
	FIREBASE_MESSAGING_SENDER_ID,
	FIREBASE_APP_ID,
} = process.env;

// check if all required keys are defined
if (
	!(
		FIREBASE_API_KEY &&
		FIREBASE_AUTH_DOMAIN &&
		FIREBASE_DATABASE_URL &&
		FIREBASE_PROJECT_ID &&
		FIREBASE_STORAGE_BUCKET &&
		FIREBASE_MESSAGING_SENDER_ID &&
		FIREBASE_APP_ID
	)
) {
	console.error({
		FIREBASE_API_KEY: typeof FIREBASE_API_KEY,
		FIREBASE_AUTH_DOMAIN: typeof FIREBASE_AUTH_DOMAIN,
		FIREBASE_DATABASE_URL: typeof FIREBASE_DATABASE_URL,
		FIREBASE_PROJECT_ID: typeof FIREBASE_PROJECT_ID,
		FIREBASE_STORAGE_BUCKET: typeof FIREBASE_STORAGE_BUCKET,
		FIREBASE_MESSAGING_SENDER_ID: typeof FIREBASE_MESSAGING_SENDER_ID,
		FIREBASE_APP_ID: typeof FIREBASE_APP_ID,
	});
	throw Error(`Firebase config keys not defined correctly`);
}

// setup firebase config object
const firebaseConfig = {
	apiKey: FIREBASE_API_KEY,
	authDomain: FIREBASE_AUTH_DOMAIN,
	databaseURL: FIREBASE_DATABASE_URL,
	projectId: FIREBASE_PROJECT_ID,
	storageBucket: FIREBASE_STORAGE_BUCKET,
	messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
	appId: FIREBASE_APP_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firestoreLive = firebase.firestore();

const _firestoreEmulator = firebase.firestore();
_firestoreEmulator.useEmulator('localhost', 8080);
export const firestoreEmulator = _firestoreEmulator;

export function isFirestoreEmulatorRunning() {
	return urlExistSync('http://localhost:4000/firestore'); 
}

// Firebase App (the core Firebase SDK) is always required and
// Add the Firebase services that you want to use
import 'firebase/auth';
import 'firebase/firestore';

// import dotenv from 'dotenv';
// must be listed before other Firebase SDKs
import firebase from 'firebase/app';
import urlExistSync from 'url-exist-sync';

import config from '../private/firebase-config';
import isProductionEnvironment from './utils/isProductionEnvironment';

// const localDotenvPath = path.resolve(__dirname, '..', '.env');

// load local dotenv entries
// dotenv.config({ path: localDotenvPath });

// destructure required entries
const {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} = config;

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

////////////////////////////////////////////////////////
// Firebase Authentication exports

const _auth = firebase.auth();
_auth.useEmulator("http://localhost:9099"); // todo use environment variables to conditionally use this
export const auth = _auth;

export const { GoogleAuthProvider, EmailAuthProvider } = firebase.auth;

export interface FireBaseUser extends firebase.User {}

////////////////////////////////////////////////////////
// Firestore exports

export const firestore = firebase.firestore();
if (!isProductionEnvironment()) firestore.useEmulator("localhost", 8080);

export function isFirestoreEmulatorRunning(): boolean {
  return urlExistSync("http://localhost:4000/firestore/");
}

// ? is a deep recursive delete util required?
// from https://firebase.google.com/docs/firestore/manage-data/delete-data
/*
async function deleteDocumentsCompletely(query: firebase.firestore.Query) {
	return new Promise((resolve, reject) => {
		deleteQueryBatch(query, resolve).catch(reject);
	});
}

async function deleteQueryBatch(query: firebase.firestore.Query, resolve: (value?: unknown) => void) {
	const snapshot = await query.get();

	const batchSize = snapshot.size;
	if (batchSize === 0) {
		// When there are no documents left, we are done
		resolve();
		return;
	}

	// Delete documents in a batch
	const batch = query.firestore.batch();
	snapshot.docs.forEach(doc => {
		batch.delete(doc.ref);
	});
	await batch.commit();

	// Recurse on the next process tick, to avoid
	// exploding the stack.
	process.nextTick(() => {
		deleteQueryBatch(query, resolve);
	});
}
*/

// firebase type aliases
export type Firestore = firebase.firestore.Firestore;

export type FirestoreDocumentChange =
  firebase.firestore.DocumentChange<firebase.firestore.DocumentData>;

export type FirestoreBatch = firebase.firestore.WriteBatch;

export type FirestoreDocumentSnapshot =
  firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>;

export type FirestoreCollectionSnapshot =
  firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;

export type FirestoreDocumentReference =
  firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;

export type FirestoreCollectionReference =
  firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;

// export default firebase;

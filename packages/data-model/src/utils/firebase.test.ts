import urlExistSync from 'url-exist-sync';
import { firestoreEmulator, isFirestoreEmulatorRunning } from './firebase';

const testDocData = { test: `test @ ${new Date().toLocaleString()}` };
const testCollectionName = 'test';
const testDocumentName = 'testDoc';

// if ( !urlExistSync( 'http://localhost:4000/firestore' ) ) throw Error( 'Firestore emulator not running' );

describe('firestore emulator', () => {
	it('tests if firestore emulator is running', () => {
		if (!isFirestoreEmulatorRunning()) throw Error('Firestore emulator not running');
		expect(isFirestoreEmulatorRunning()).toEqual(true);
	});

	it('can write to firestore documents', async () => {
		expect.assertions(1);
		await expect(
			firestoreEmulator.doc(`${testCollectionName}/${testDocumentName}`).set(testDocData)
		).resolves.toBeFalsy();
	});

	it('can read from firestore documents', async () => {
		expect.assertions(1);
		await expect(
			firestoreEmulator
				.doc(`${testCollectionName}/${testDocumentName}`)
				.get()
				.then(doc => doc.data())
		).resolves.toEqual(testDocData);
	});

	it('can read from firestore collections', async () => {
		expect.assertions(1);
		await expect(
			firestoreEmulator
				.collection(testCollectionName)
				.get()
				.then(col => col.size)
		).resolves.toBeGreaterThanOrEqual(1);
	});

	it('can detect changes to firestore collections', () => {});

	it('can delete items from firestore collections', async () => {
		expect.assertions(1);
		await expect(firestoreEmulator.doc(`${testCollectionName}/${testDocumentName}`).delete()).resolves.toBeFalsy();
	});

	it('can detect changes to firestore documents', async () => {
		expect.assertions(3);

		const localTestCollectionName = `${testCollectionName}WithListener`;
		const observer = firestoreEmulator.collection(localTestCollectionName).onSnapshot(querySnapshot => {
			querySnapshot.docChanges().forEach(change => {
				const data: any = change.doc.data();
				console.warn('item change', change);
				if (change.type === 'added') {
					console.warn('New item: ', { data });
					expect(data).toEqual(testDocData);
				}
				if (change.type === 'modified') {
					console.warn('Modified city: ', { data });
					expect(data.added).toBeTruthy();
				}
				if (change.type === 'removed') {
					console.warn('Removed city: ', { data });
					expect(
						firestoreEmulator
							.collection(localTestCollectionName)
							.get()
							.then(col => expect(col.size).toEqual(0))
					);
				}
			});
		});

		console.warn('observer attached');

		// assertion 1
		await firestoreEmulator.doc(`${localTestCollectionName}/${testDocumentName}`).set(testDocData);

		// assertion 2
		await firestoreEmulator.doc(`${localTestCollectionName}/${testDocumentName}`).update({ added: 'something' });

		// assertion 3
		await firestoreEmulator.doc(`${localTestCollectionName}/${testDocumentName}`).delete();

		// detach observer
		observer();
		console.warn('observer detached');

		// these should not create any events on observer
		await firestoreEmulator.doc(`${localTestCollectionName}/${testDocumentName}`).set(testDocData);
		await firestoreEmulator.doc(`${localTestCollectionName}/${testDocumentName}`).update({ added: 'something' });
		await firestoreEmulator.doc(`${localTestCollectionName}/${testDocumentName}`).delete();
	});
});
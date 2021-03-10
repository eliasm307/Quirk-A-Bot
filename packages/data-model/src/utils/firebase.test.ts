import urlExistSync from 'url-exist-sync';
import { firestoreEmulator, isFirestoreEmulatorRunning } from './firebase';
import logFirestoreChange from './logFirestoreChange';

const testDocData = { testProperty: `testing @ ${new Date().toLocaleString()}` };
const testCollectionName = 'testCollection';
const testDocumentName = 'testDoc';

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

	it('can delete items from firestore collections', async () => {
		expect.assertions(1);
		await expect(firestoreEmulator.doc(`${testCollectionName}/${testDocumentName}`).delete()).resolves.toBeFalsy();
	});

	it('can detect changes to firestore documents and collections', async () => {
		expect.assertions(6);

		const localTestCollectionName = `${testCollectionName}WithListener`;

		// make sure there is no existing data
		await firestoreEmulator.doc(`${localTestCollectionName}/${testDocumentName}`).delete();

		// subscribe to document level changes
		const unsubscribeToDocument = firestoreEmulator.doc(`${localTestCollectionName}/${testDocumentName}`).onSnapshot({
			next: snapshot => {
				const data: any = snapshot.data();
				// console.log('doc change', { data });
				if (snapshot.exists) {
					if (snapshot.metadata.hasPendingWrites) {
						// console.log('Modified document: ', { data });
						expect(data).toBeTruthy();
					} else {
						// console.log('snapshot has no pending writes', data);
					}
				} else {
					// console.log('snapshot does not exist, was this document deleted?', data);
					expect(data).toBeFalsy();
				}
			},
			error: console.error,
		});

		// console.log('document observer attached');

		// todo delete existing documents before attaching listeners

		// subscribe to collection level changes
		const unsubscribeToCollection = firestoreEmulator.collection(localTestCollectionName).onSnapshot(querySnapshot => {
			querySnapshot.docChanges().forEach(change => {
				const data: any = change.doc.data();

				if(!change.doc.exists) throw Error(`Document at path ${localTestCollectionName}/${change.doc.id} is marked as doesnt exist`)

				logFirestoreChange(change, console.log);
				if (change.type === 'added') {
					// console.log('New item: ', { data });
					expect(data).toEqual(testDocData);
				}
				if (change.type === 'modified') {
					// console.log('Modified document: ', { data });
					expect(data.added).toBeTruthy();
				}
				if (change.type === 'removed') {
					// console.log('Removed document: ', { data });
					expect(
						firestoreEmulator
							.collection(localTestCollectionName)
							.get()
							.then(col => expect(col.size).toEqual(0))
					);
				}
			});
		});

		// console.log('collection observer attached');

		// assertion 1 & 2 (collection and document events)
		// console.log('creating document');
		await firestoreEmulator.doc(`${localTestCollectionName}/${testDocumentName}`).set(testDocData);

		// assertion 3 & 4 (collection and document events)
		// console.log('updating document');
		await firestoreEmulator.doc(`${localTestCollectionName}/${testDocumentName}`).update({ added: 'something' });

		// assertion 5 & 6 (collection and document events)
		// console.log('deleting document');
		await firestoreEmulator.doc(`${localTestCollectionName}/${testDocumentName}`).delete();

		// detach observers
		unsubscribeToCollection();
		unsubscribeToDocument();
		// console.log('observers detached');

		// these should not create any events on observer
		await firestoreEmulator.doc(`${localTestCollectionName}/${testDocumentName}`).set(testDocData);
		await firestoreEmulator.doc(`${localTestCollectionName}/${testDocumentName}`).update({ added: 'something' });
		await firestoreEmulator.doc(`${localTestCollectionName}/${testDocumentName}`).delete();
	});
});

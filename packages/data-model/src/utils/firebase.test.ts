import urlExistSync from 'url-exist-sync';
import { firestoreEmulator, isFirestoreEmulatorRunning } from './firebase';

const testDocData = { test: `test @ ${new Date().toLocaleString()}` };

// if ( !urlExistSync( 'http://localhost:4000/firestore' ) ) throw Error( 'Firestore emulator not running' );

describe('firestore emulator', () => {
	it('tests if firestore emulator is running', () => {
		if (!isFirestoreEmulatorRunning()) throw Error('Firestore emulator not running');
		expect(isFirestoreEmulatorRunning()).toEqual(true);
	});

	it('tests firestore writing', async () => {
		expect.assertions(1);
		await expect(firestoreEmulator.doc('test/initial').set(testDocData)).resolves.toBeFalsy();
	}, 6000);

	it('testsfirestore reading', async () => {
		expect.assertions(1);
		await expect(
			firestoreEmulator
				.doc('test/initial')
				.get()
				.then(doc => doc.data())
		).resolves.toEqual(testDocData);
	});
});

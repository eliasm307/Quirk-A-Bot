import { firestoreEmulator } from './firebase';

test('Basic firebase read and write tests', async () => {
	expect.assertions(1);

	await expect(firestoreEmulator.doc('test/initial').set({ test: `test @ ${new Date().toLocaleString()}` })).resolves.toReturn;
});

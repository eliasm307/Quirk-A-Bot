import { database } from './firebase';

test('Basic firebase read and write tests', async () => {
	expect.assertions(1);
	await expect(database.ref('/test').set({ test: 'test' })).resolves.toBeTruthy();
});

import hasCleanUp from './hasCleanUp';

test('hasCleanUp predicate', () => {
	expect(hasCleanUp({ cleanUp: () => {} })).toBeTruthy();
	expect(hasCleanUp(5)).toBeFalsy();
	expect(hasCleanUp({})).toBeFalsy();
});

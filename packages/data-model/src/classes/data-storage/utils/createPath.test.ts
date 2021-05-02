import { createPath } from './createPath';

it('should create paths', () => {
	const parentPath = 'parent';
	const name = 'name';
	expect(createPath(parentPath, name)).toEqual('parent/name');
	expect(createPath(parentPath + '/mid', name)).toEqual('parent/mid/name');
});

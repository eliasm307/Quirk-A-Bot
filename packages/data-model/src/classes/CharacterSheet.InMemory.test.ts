import CharacterSheet from './CharacterSheet';
import InMemoryDataStorageFactory from './data-storage/InMemory/InMemoryDataStorageFactory';

const parentPath = 'characterSheetInMemoryTest';
const dataStorageFactory = new InMemoryDataStorageFactory({});

describe('Charactersheet in memory', () => {
	it('does not accept bad ids', () => {
		expect.hasAssertions();

		expect(CharacterSheet.load({ dataStorageFactory, id: 'Bad Id', parentPath })).toThrow();
		expect(CharacterSheet.load({ dataStorageFactory, id: '99#646', parentPath })).toThrow();
		expect(CharacterSheet.load({ dataStorageFactory, id: 'a.b', parentPath })).toThrow();
		expect(CharacterSheet.load({ dataStorageFactory, id: '!151dd', parentPath })).toThrow();
	});
});

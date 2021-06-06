import InMemoryDataStorageFactory from '../data-storage/InMemory/InMemoryDataStorageFactory';

const parentPath = "characterSheetInMemoryTest";
const dataStorageFactory = new InMemoryDataStorageFactory();

describe("Charactersheet in memory", () => {
  it("does not accept bad ids", async () => {
    // expect.hasAssertions();
    // expect.assertions(4);
    // TODO this is really a test of the util that decides if the id is valid or not
    /*
		await expect(CharacterSheet.load({ dataStorageFactory, id: 'Bad Id', parentPath })).rejects.toBeFalsy();
		await expect(CharacterSheet.load({ dataStorageFactory, id: '99#646', parentPath })).rejects.toBeFalsy();
		await expect(CharacterSheet.load({ dataStorageFactory, id: 'a.b', parentPath })).rejects.toBeFalsy();
		await expect(CharacterSheet.load({ dataStorageFactory, id: '!151dd', parentPath })).rejects.toBeFalsy();*/
  });
});

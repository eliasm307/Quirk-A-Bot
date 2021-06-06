import { CharacterSheet } from '../../..';
import { createPath } from '../../data-storage/utils/createPath';
import CharacterSheetFirestoreCompositeModel from './character-sheet';

// firestore composite - rx
const parentPath = "fc-rx-characterSheetTraitDocsCollection";

describe("Firestore Composite Character Sheet Model using RX", () => {
  it("can create a new character sheet", async (done) => {
    expect.hasAssertions();

    const id = "newCharacterSheetTraits";

    const docPath = createPath(parentPath, id);

    const model = new CharacterSheetFirestoreCompositeModel({ id, parentPath });

    model.changes.subscribe({
      error: console.error,
      next: (data: any) => console.warn({ data }),
    });

    model.update(CharacterSheet.newDataObject({ id }));

    await new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
      }, 5000)
    )
      .then(() => model.dispose())
      .catch(console.error)
      .finally(done);
  });
});

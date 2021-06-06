import { createPath } from '../../data-storage-OLD/utils/createPath';
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
      next: (data) => console.warn({ data }),
    });

    await new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
      }, 5000)
    )
      .then(model.dispose)
      .finally(done);
  });
});

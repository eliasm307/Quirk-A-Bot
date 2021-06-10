import { scan } from 'rxjs/operators';

import { firestore, pause } from '@quirk-a-bot/common';

import { CharacterSheet } from '../../..';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { createPath } from '../../data-storage/utils/createPath';
import CharacterSheetFirestoreCompositeModel from './character-sheet';

// firestore composite - rx
const parentPath = "fc-rx-characterSheetTraitDocsCollection";

describe("Firestore Composite Character Sheet Model using RX", () => {
  it("can create a new character sheet", async (done) => {
    // expect.hasAssertions();

    const id = "newCharacterSheetTraits";

    const docPath = createPath(parentPath, id);

    await firestore.doc(docPath).delete();

    await pause(1000);

    const model = new CharacterSheetFirestoreCompositeModel({ id, parentPath });

    const subscription = model.changes
      .pipe(
        scan(
          (_, data, index) => ({ data, index }),
          {} as {
            index: number;
            data: iCharacterSheetData | undefined;
          }
        )
      )
      .subscribe({
        error: console.error,
        next: (value) => {
          console.warn({ value });

          const { data, index } = value;

          switch (index) {
            case 0:
              break;
            default:
            // do nothing
          }
        },
      });

    // await pause(1000);

    model.update(CharacterSheet.newDataObject({ id }));

    await new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
      }, 10000)
    )
      .then(() => {
        subscription.unsubscribe();
        model.dispose();
        return undefined;
      })
      .catch(console.error)
      .finally(done);
  }, 19999);

  it("can initialise from an existing character sheet", async (done) => {
    expect.hasAssertions();
  });
});

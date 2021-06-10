import { scan } from 'rxjs/operators';

import { firestore, pause } from '@quirk-a-bot/common';

import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { createPath } from '../../data-storage/utils/createPath';
import CharacterSheetFirestoreCompositeModel from './character-sheet';

// firestore composite - rx
const parentPath = "fc-rx-characterSheetTraitDocsCollection";

describe("Firestore Composite Character Sheet Model using RX", () => {
  it("can create a new character sheet", async (done) => {
    expect.hasAssertions();

    const id = "newCharacterSheetTraits";

    const docPath = createPath(parentPath, id);

    await firestore.doc(docPath).delete();

    await pause(500);

    const initialData: iCharacterSheetData = {
      id,
      bloodPotency: { name: "Blood Potency", value: 5 },
      health: { name: "Health", value: 9 },
      humanity: { name: "Humanity", value: 2 },
      hunger: { name: "Hunger", value: 4 },
      willpower: { name: "Willpower", value: 6 },
      name: { name: "Name", value: "test name" },
      sire: { name: "Sire", value: "some sire" },
      clan: { name: "Clan", value: "best clan" },
      attributes: [
        { name: "Charisma", value: 3 },
        { name: "Manipulation", value: 2 },
      ],
      disciplines: [{ name: "Blood Sorcery", value: 3 }],
      skills: [
        { name: "Academics", value: 2 },
        { name: "Brawl", value: 2 },
        { name: "Firearms", value: 4 },
      ],
      touchstonesAndConvictions: [
        { name: "de name", value: "val f f f " },
        { name: "dfff", value: "val  f f ff " },
        { name: "ededed", value: "val  f f f f" },
      ],
    };

    const model = new CharacterSheetFirestoreCompositeModel({ id, parentPath });

    const subscription = model.changes
      .pipe(
        // get the index of changes
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
          console.warn(__filename, "newDataUpdateReceived", { value });

          const { data, index } = value;

          switch (index) {
            case 0:
              expect(data).toEqual(initialData);
            // eslint-disable-next-line no-fallthrough
            default:
              // stop when the known updates are done
              subscription.unsubscribe();
              model.dispose();
              done();
          }
        },
      });

    // await pause(1000);

    // update 1
    model.update(initialData);

    /*
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
  */
  });
  it("can initialise from an existing character sheet", async (done) => {
    expect.hasAssertions();
  });
});

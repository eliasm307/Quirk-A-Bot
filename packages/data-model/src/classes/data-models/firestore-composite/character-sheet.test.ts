import { scan } from 'rxjs/operators';

import { firestore, pause } from '@quirk-a-bot/common';

import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { createPath } from '../../data-storage/utils/createPath';
import CharacterSheetFirestoreCompositeModelReader from './CharacterSheetModelReader';
import CharacterSheetFirestoreCompositeModelWriter from './CharacterSheetModelWriter';

// firestore composite - rx
const parentPath = "fc-rx-characterSheetTraitDocsCollection";

const newInitialData = (id: string): iCharacterSheetData => ({
  id,
  coreNumberTraits: {
    "Blood Potency": { name: "Blood Potency", value: 5 },
    Health: { name: "Health", value: 9 },
    Humanity: { name: "Humanity", value: 2 },
    Hunger: { name: "Hunger", value: 4 },
    Willpower: { name: "Willpower", value: 6 },
  },
  coreStringTraits: {
    Clan: { name: "Clan", value: "best clan" },
    Name: { name: "Name", value: "test name" },
    Sire: { name: "Sire", value: "some sire" },
  },
  img: "",

  attributes: {
    Charisma: { name: "Charisma", value: 3 },
    Manipulation: { name: "Manipulation", value: 2 },
  },
  disciplines: { "Blood Sorcery": { name: "Blood Sorcery", value: 3 } },
  skills: {
    Academics: { name: "Academics", value: 2 },
    Brawl: { name: "Brawl", value: 2 },
    Firearms: { name: "Firearms", value: 4 },
  },
  touchstonesAndConvictions: {
    "de name": { name: "de name", value: "val f f f " },
    dfff: { name: "dfff", value: "val  f f ff " },
    ededed: { name: "ededed", value: "val  f f f f" },
  },
});

// todo separate
describe("Firestore Composite Character Sheet Model using RX", () => {
  afterAll(async () => {
    // await firestore.app.delete();
    await firestore.terminate();
    await firestore.clearPersistence();
    await pause(500); // avoid jest open handle error
  });

  it("can create a new character sheet", (done) => {
    expect.hasAssertions();

    const id = "newCharacterSheetTraits";
    const docPath = createPath(parentPath, id);

    const modelProps = {
      id,
      parentPath,
    };

    const test = async () => {
      await firestore.doc(docPath).delete();

      await pause(500);

      const modelReader = new CharacterSheetFirestoreCompositeModelReader(
        modelProps
      );

      const modelWriter = new CharacterSheetFirestoreCompositeModelWriter(
        modelProps
      );

      let updateCount = 0;

      const subscription = modelReader.change$
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
            updateCount++;
            console.warn(__filename, "newDataUpdateReceived", value);

            const { data, index } = value;

            switch (index) {
              case 0:
                expect(data).toEqual(newInitialData(id));
                break;
              default:
                console.error(`unexpected update`, value);
            }
          },
        });

      // update 0
      modelWriter.set(newInitialData(id));

      // delay then stop test, to make sure all updates come in
      await pause(5000).then(() => {
        console.log(`Timer end`);

        // stop when the known updates are done
        subscription.unsubscribe();
        modelReader.dispose();

        // only one sync expected
        expect(updateCount).toEqual(1);

        // eslint-disable-next-line promise/no-callback-in-promise
        done();
        return undefined;
      });
    };

    // run test async
    void test();
  }, 19999);

  it("can initialise from an existing character sheet", (done) => {
    expect.hasAssertions();

    const id = "existingCharacterSheetTraits";
    const docPath = createPath(parentPath, id);

    const initialData = newInitialData(id);

    const test = async () => {
      await firestore.doc(docPath).set(initialData);

      // make sure changes are synchronised
      await pause(500);

      const modelReader = new CharacterSheetFirestoreCompositeModelReader({
        id,
        parentPath,
      });

      let updateCount = 0;

      const subscription = modelReader.change$
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
            updateCount++;
            console.warn(__filename, "newDataUpdateReceived", value);

            const { data, index } = value;

            switch (index) {
              case 0:
                expect(data).toEqual(initialData);
                break;
              default:
                console.error(`unexpected update`, value);
            }
          },
        });

      // delay then stop test, to make sure all updates come in
      await pause(5000).then(() => {
        console.log(`Timer end`);

        // stop when the known updates are done
        subscription.unsubscribe();
        modelReader.dispose();

        // only one sync expected
        expect(updateCount).toEqual(1);

        // eslint-disable-next-line promise/no-callback-in-promise
        done();
        return undefined;
      });
    };

    // run test async
    void test();
  }, 19999);
});

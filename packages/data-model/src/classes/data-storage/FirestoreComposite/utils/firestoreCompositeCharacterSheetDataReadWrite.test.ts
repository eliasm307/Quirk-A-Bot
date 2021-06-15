import { createObjectAlphabeticalSorter, firestoreEmulator, pause } from '@quirk-a-bot/common';

import {
  iCharacterSheetDataOLD,
} from '../../../character-sheet/interfaces/character-sheet-interfaces';
import {
  iAttributeData, iBaseTraitData, iGeneralTraitData,
} from '../../../traits/interfaces/trait-interfaces';
import { createPath } from '../../utils/createPath';
import readCharacterSheetDataFromFirestoreComposite from './readCharacterSheetData';
import writeCharacterSheetDataToFirestoreComposite from './writeCharacterSheetData';

const firestore = firestoreEmulator;

describe("firestoreCompositeCharacterSheetDataReadWrite.test", () => {
  it("can write and read complete character sheet data to firestore", async () => {
    const id = "compositeReadWriteTest";

    const path = createPath(`writeCharacterSheetDataToFirestoreComposite`, id);

    const characterSheetData: iCharacterSheetDataOLD = {
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
        { name: "de name", value: "value f f f " },
        { name: "name2", value: "value  f f ff " },
        { name: "ededed", value: "clan  f f f f" },
      ],
    };

    await expect(
      writeCharacterSheetDataToFirestoreComposite({
        data: characterSheetData,
        firestore,
        path,
      })
    ).resolves.toBeUndefined();

    await pause(200);

    const {
      attributes,
      bloodPotency,
      clan,
      disciplines,
      health,
      humanity,
      hunger,
      id: readId,
      name,
      sire,
      skills,
      touchstonesAndConvictions,
      willpower,
    } = await readCharacterSheetDataFromFirestoreComposite({
      firestore,
      path,
    });

    const sorter = createObjectAlphabeticalSorter<iGeneralTraitData>("name");

    // compare individual values
    expect({
      bloodPotency,
      clan,
      health,
      humanity,
      hunger,
      name,
      sire,
      willpower,
      id,
    }).toEqual({
      id: readId,
      bloodPotency: characterSheetData.bloodPotency,
      clan: characterSheetData.clan,
      health: characterSheetData.health,
      humanity: characterSheetData.humanity,
      hunger: characterSheetData.hunger,
      name: characterSheetData.name,
      sire: characterSheetData.sire,
      willpower: characterSheetData.willpower,
    });

    // compare trait collections
    expect(attributes.sort(sorter)).toEqual(
      characterSheetData.attributes.sort(sorter)
    );
    expect(disciplines.sort(sorter)).toEqual(
      characterSheetData.disciplines.sort(sorter)
    );
    expect(skills.sort(sorter)).toEqual(characterSheetData.skills.sort(sorter));
    expect(touchstonesAndConvictions.sort(sorter)).toEqual(
      characterSheetData.touchstonesAndConvictions.sort(sorter)
    );
  });
});

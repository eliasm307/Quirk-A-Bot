import { firestoreEmulator, pause } from '@quirk-a-bot/common';

import {
  iCharacterSheetData,
} from '../../../character-sheet/interfaces/character-sheet-interfaces';
import { createPath } from '../../utils/createPath';
import readCharacterSheetDataFromFirestoreComposite from './readCharacterSheetDataFromFirestoreComposite';
import writeCharacterSheetDataToFirestoreComposite from './writeCharacterSheetDataToFirestoreComposite';

const firestore = firestoreEmulator;

describe("read/writeCharacterSheetDataToFirestoreComposite", () => {
  it("can write and read complete character sheet data to firestore", async () => {
    const id = "compositeReadWriteTest";

    const path = createPath(`writeCharacterSheetDataToFirestoreComposite`, id);

    const characterSheetData: iCharacterSheetData = {
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
        { name: "de ekidn", value: "kdonoxc f f f " },
        { name: "dfff", value: "rvrrvrv  f f ff " },
        { name: "ededed", value: "kdonoxc  f f f f" },
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

    await expect(
      readCharacterSheetDataFromFirestoreComposite({
        firestore,
        path,
      })
    ).resolves.toEqual(characterSheetData);
  });
});

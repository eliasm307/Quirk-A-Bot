import {
  iCharacterSheetDataOLD,
} from '../../classes/character-sheet/interfaces/character-sheet-interfaces';
import isCharacterSheetDataOLD from './isCharacterSheetDataOLD';

test("Character sheet data predicate", () => {
  const correctData: iCharacterSheetDataOLD = {
    attributes: [],
    disciplines: [],
    skills: [],
    touchstonesAndConvictions: [],
    id: "0",
    bloodPotency: { name: "Blood Potency", value: 2 },
    clan: { name: "Clan", value: "clan" },
    health: { name: "Health", value: 2 },
    humanity: { name: "Humanity", value: 2 },
    hunger: { name: "Hunger", value: 2 },
    name: { name: "Name", value: "name" },
    sire: { name: "Sire", value: "name" },
    willpower: { name: "Willpower", value: 2 },
  };

  // todo give data variables friendly names
  // copy and invalidate good data
  const badData1: any = { ...correctData, health: {} };
  const badData2: any = { ...correctData };
  delete badData2.id;
  const badData3 = { ...correctData, health: { name: "" } };

  const badData4 = { ...correctData, skills: { name: "" } };
  const badData5 = {
    ...correctData,
    skills: [{ name: "" }, { name: "Hunger", value: 2 }],
  };
  const badData6 = { ...correctData, health: { name: 5, value: 5 } };
  const badData7 = { ...correctData, clan: { name: "" } };
  const badData8 = { ...correctData, id: false };

  expect(isCharacterSheetDataOLD(correctData)).toBeTruthy();
  expect(isCharacterSheetDataOLD(1)).toBeFalsy();
  expect(isCharacterSheetDataOLD(badData1)).toBeFalsy();
  expect(isCharacterSheetDataOLD(badData2)).toBeFalsy();
  expect(isCharacterSheetDataOLD(badData3)).toBeFalsy();
  expect(isCharacterSheetDataOLD(badData4)).toBeFalsy();
  expect(isCharacterSheetDataOLD(badData5)).toBeFalsy();
  expect(isCharacterSheetDataOLD(badData6)).toBeFalsy();
  expect(isCharacterSheetDataOLD(badData7)).toBeFalsy();
  expect(isCharacterSheetDataOLD(badData8)).toBeFalsy();
});

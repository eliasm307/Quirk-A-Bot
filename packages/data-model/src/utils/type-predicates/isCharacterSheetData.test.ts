import {
  iCharacterSheetData,
} from '../../classes/character-sheet/interfaces/character-sheet-interfaces';
import isCharacterSheetData from './isCharacterSheetData';

test("Character sheet data predicate", () => {
  const correctData: iCharacterSheetData = {
    attributes: {},
    disciplines: {},
    skills: {},
    touchstonesAndConvictions: {},
    coreNumberTraits: {
      "Blood Potency": { name: "Blood Potency", value: 2 },
      Health: { name: "Health", value: 2 },
      Humanity: { name: "Humanity", value: 2 },
      Hunger: { name: "Hunger", value: 2 },
      Willpower: { name: "Willpower", value: 2 },
    },
    coreStringTraits: {
      Clan: { name: "Clan", value: "clan" },
      Name: { name: "Name", value: "name" },
      Sire: { name: "Sire", value: "name" },
    },
    id: "0",
    img: "",
  };

  // todo give data variables friendly names
  // copy and invalidate good data
  const badData1: any = { ...correctData, coreNumberTraits: { health: {} } };
  const { id, ...badData2 } = correctData; // remove id prop

  const badData3 = {
    ...correctData,
    coreNumberTraits: { health: { name: "" } },
  };

  const badData4 = { ...correctData, skills: { name: "" } };
  const badData5 = {
    ...correctData,
    skills: { x: { name: "" }, Hunger: { name: "Hunger", value: 2 } },
  };
  const badData6 = {
    ...correctData,
    coreNumberTraits: { Health: { name: 5, value: 5 } },
  };
  const badData7 = { ...correctData, coreStringTraits: { Clan: { name: "" } } };
  const badData8 = { ...correctData, id: false };

  expect(isCharacterSheetData(correctData)).toBeTruthy();
  expect(isCharacterSheetData(1)).toBeFalsy();
  expect(isCharacterSheetData(badData1)).toBeFalsy();
  expect(isCharacterSheetData(badData2)).toBeFalsy();
  expect(isCharacterSheetData(badData3)).toBeFalsy();
  expect(isCharacterSheetData(badData4)).toBeFalsy();
  expect(isCharacterSheetData(badData5)).toBeFalsy();
  expect(isCharacterSheetData(badData6)).toBeFalsy();
  expect(isCharacterSheetData(badData7)).toBeFalsy();
  expect(isCharacterSheetData(badData8)).toBeFalsy();
});

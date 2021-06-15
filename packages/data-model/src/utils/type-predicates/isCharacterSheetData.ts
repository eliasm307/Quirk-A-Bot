import CharacterSheet from '../../classes/character-sheet/CharacterSheet-OLD';
import {
  iCharacterSheetData, iCharacterSheetDataOLD,
} from '../../classes/character-sheet/interfaces/character-sheet-interfaces';
import isTraitData from './isTraitData';

export default function isCharacterSheetData(
  data: unknown
): data is iCharacterSheetData {
  // todo test
  if (typeof data !== "object") return false;

  if (!data) return false;

  const {
    attributes,
    disciplines,
    skills,
    touchstonesAndConvictions,
    coreNumberTraits,
    coreStringTraits,
    id,
    img,
  } = data as iCharacterSheetData;

  // ts property check, will throw an error if the schema is changed but predicate not updated
  ((): iCharacterSheetData => ({
    attributes,
    disciplines,
    skills,
    touchstonesAndConvictions,
    coreNumberTraits,
    coreStringTraits,
    id,
    img,
  }))();

  if (!id) {
    console.warn(`isCharacterSheetData, id is falsy`, {
      id,
    });

    return false;
  }

  // check primitive values
  if (typeof id !== "number" && typeof id !== "string") {
    console.warn(
      `isCharacterSheetData, id is not a number or string, it is ${typeof id}`,
      {
        id,
      }
    );

    return false;
  }

  // check core number traits
  /*
  const coreNumberTraitData: unknown[] = [
    health,
    humanity,
    hunger,
    willpower,
    bloodPotency,
  ];
  */

  for (const traitData of Object.values(coreNumberTraits)) {
    if (!isTraitData(traitData) || typeof traitData.value !== "number") {
      /*
      console.warn(
				`isCharacterSheetData, core number trait ${traitData} is not a valid trait data or does not have a number value`,
				{ traitData, isTraitData: isTraitData(traitData), typeofValue: typeof traitData.value }
			);*/
      return false;
    }
  }

  // check core string traits
  // const coreStringTraitData: unknown[] = [clan, name, sire];
  for (const traitData of Object.values(coreStringTraits)) {
    if (!isTraitData(traitData) || typeof traitData.value !== "string") {
      console.warn(
        `isCharacterSheetData, core string trait  is not a valid trait data or does not have a string value`,
        {
          traitData,
          isTraitData: isTraitData(traitData),
          typeofValue: typeof traitData,
        }
      );
      return false;
    }
  }

  // check trait arrays
  const traitDataCollections: any = {
    attributes,
    disciplines,
    skills,
    touchstonesAndConvictions,
  };
  for (const [traitCollectionName, traitDataObjectMap] of Object.entries(
    traitDataCollections
  )) {
    if (typeof traitDataObjectMap !== "object" || !traitDataObjectMap) {
      /*
      console.warn(
        `isCharacterSheetData, trait collection is not an array, it is "${typeof traitDataArray}"`,
        {
          traitDataArray,
        }
      );
      */
      return false;
    }
    for (const traitData of Object.values(traitDataObjectMap)) {
      if (!isTraitData(traitData)) {
        /*
        console.warn(
          `isCharacterSheetData, item in trait collection ${traitCollectionName} is not a valid trait data, it is "${typeof traitData}"`,
          {
            traitData,
            isTraitData: isTraitData(traitData),
            typeofValue: typeof traitData,
          }
        );
        */
        return false;
      }
    }
  }

  // if all checks pass then it is what it is
  return true;
  // todo test this
}

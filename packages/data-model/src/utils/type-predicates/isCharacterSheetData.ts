import CharacterSheet from '../../classes/character-sheet/CharacterSheet';
import {
  iCharacterSheetData,
} from '../../classes/character-sheet/interfaces/character-sheet-interfaces';
import isTraitData from './isTraitData';

export default function isCharacterSheetData(
  data: unknown
): data is iCharacterSheetData {
  // todo test
  if (typeof data !== "object") {
    /*
    console.warn(
      `isCharacterSheetData, data is not an object, it is ${typeof data}`
    );
    */
    return false;
  }
  if (!data) return false;

  const exampleCorrectData = CharacterSheet.newDataObject({ id: "" });

  const {
    attributes,
    bloodPotency,
    clan,
    disciplines,
    id,
    health,
    humanity,
    hunger,
    name,
    sire,
    skills,
    touchstonesAndConvictions,
    willpower,
  } = data as iCharacterSheetData;

  // todo add property  check

  const receivedNumberOfProperties = Object.keys(data).length;
  const correctNumberOfProperties = Object.keys(exampleCorrectData).length;

  // check number of properties
  if (receivedNumberOfProperties !== correctNumberOfProperties) {
    /*
		console.warn(
			`isCharacterSheetData, data does not have the right number of properties, expected ${correctNumberOfProperties} but received ${receivedNumberOfProperties}`,
			{
				correctNumberOfProperties,
				receivedNumberOfProperties,
				data,
				correctData: exampleCorrectData,
			}
		);
    */
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
  const coreNumberTraitData: unknown[] = [
    health,
    humanity,
    hunger,
    willpower,
    bloodPotency,
  ];

  for (const traitData of coreNumberTraitData) {
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
  const coreStringTraitData: any[] = [clan, name, sire];
  for (const traitData of coreStringTraitData) {
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
  for (const [traitCollectionName, traitDataArray] of Object.entries(
    traitDataCollections
  )) {
    if (!Array.isArray(traitDataArray)) {
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
    for (const traitData of traitDataArray) {
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

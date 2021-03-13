import CharacterSheet from '../../classes/characterSheet/CharacterSheet';
import {
  iCharacterSheetData
} from '../../classes/characterSheet/interfaces/character-sheet-interfaces';
import isTraitData from './isTraitData';

export default function isCharacterSheetData(data: any): data is iCharacterSheetData {
	// todo test
	if (typeof data !== 'object') {
		console.warn(`isCharacterSheetData, data is not an object, it is ${typeof data}`);
		return false;
	}

	const exampleCorrectData = CharacterSheet.newDataObject({ id: '' });

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
	} = data;

	const receivedNumberOfProperties = Object.keys(data).length;
	const correctNumberOfProperties = Object.keys(exampleCorrectData).length;

	// check number of properties
	if (receivedNumberOfProperties !== correctNumberOfProperties) {
		console.warn(
			`isCharacterSheetData, data does not have the right number of properties, expected ${correctNumberOfProperties} but received ${receivedNumberOfProperties}`,
			{
				correctNumberOfProperties,
				receivedNumberOfProperties,
				data,
				correctData: exampleCorrectData,
			}
		);
		return false;
	}

	// check primitve values
	if (typeof id !== 'number' && typeof id !== 'string') {
		console.warn(`isCharacterSheetData, id is not a number or string, it is ${typeof id}`, {
			id,
		});
		return false;
	}

	// check core number traits
	const coreNumberTraitData: any[] = [health, humanity, hunger, willpower, bloodPotency];

	for (let traitData of coreNumberTraitData) {
		if (!isTraitData(traitData) || typeof traitData.value !== 'number') {
			/*console.warn(
				`isCharacterSheetData, core number trait ${traitData} is not a valid trait data or does not have a number value`,
				{ traitData, isTraitData: isTraitData(traitData), typeofValue: typeof traitData.value }
			);*/
			return false;
		}
	}

	// check core string traits
	const coreStringTraitData: any[] = [clan, name, sire];
	for (let traitData of coreStringTraitData) {
		if (!isTraitData(traitData) || typeof traitData.value !== 'string') {
			console.warn(
				`isCharacterSheetData, core string trait ${traitData} is not a valid trait data or does not have a string value`,
				{ traitData, isTraitData: isTraitData(traitData), typeofValue: typeof traitData.value }
			);
			return false;
		}
	}

	// check trait arrays
	const traitDataCollections: any = { attributes, disciplines, skills, touchstonesAndConvictions };
	for (let [traitCollectionName, traitDataArray] of Object.entries(traitDataCollections)) {
		if (!Array.isArray(traitDataArray)) {
			console.warn(`isCharacterSheetData, trait collection is not an array, it is "${traitDataArray}"`, {
				tc: traitDataArray,
			});
			return false;
		}
		for (let traitData of traitDataArray) {
			if (!isTraitData(traitData)) {
				console.warn(
					`isCharacterSheetData, item in trait collection ${traitCollectionName} is not a valid trait data, it is "${traitData}"`,
					{
						traitData,
						isTraitData: isTraitData(traitData),
						typeofValue: typeof traitData.value,
					}
				);
				return false;
			}
		}
	}

	// if all checks pass then it is what it is
	return true;
	// todo test this
}

import { iAttribute, iCharacterSheet, iCharacterSheetModel, iDiscipline, iSkill } from '../declarations/interfaces';
import fs, { WriteOptions } from 'fs-extra';
export default class CharacterSheet implements iCharacterSheet {
	id: string = '';
	name: string = '';
	clan: string = '';
	sire: string = '';
	attributes: Map<string, iAttribute>;
	health: number;
	willpower: number;
	skills: Map<string, iSkill>;
	disciplines: Map<string, iDiscipline>;
	hunger: number;
	humanity: number;
	bloodPotency: number;
	touchstonesAndConvictions: string[];

	constructor(sheet: string | iCharacterSheet) {
		if (!sheet) throw `constructor argument not defined`;
	}

	private exportDataToFile(data: any, outputFilePath: string): void {
		const writeOptions: WriteOptions = {
			spaces: 2,
		};
		fs.ensureFile(outputFilePath) // ensure file path exists
			.then(_ => fs.writeJSON(outputFilePath, data, writeOptions)) // write JSON to file path
			.then(_ => console.log(__filename, `File: "${outputFilePath}" created successfully`)) // log success
			.catch(error => console.error(__filename, `ERROR creating File: "${outputFilePath}"`, { error })); // log error
	}
}

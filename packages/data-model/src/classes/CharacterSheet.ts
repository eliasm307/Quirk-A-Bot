import { AttributeMap, SkillMap, DisciplineMap } from './../declarations/types';
import { iAttribute, iCharacterSheet, iCharacterSheetModel, iDiscipline, iSkill } from '../declarations/interfaces';
import fs, { WriteOptions } from 'fs-extra';
import TypeFactory from './TypeFactory';
export default class CharacterSheet implements iCharacterSheet {
	readonly id: string = '';
	sire: string = '';
	attributes: AttributeMap = TypeFactory.newAttributeMap();
	skills: SkillMap = TypeFactory.newSkillMap();
	disciplines: DisciplineMap = TypeFactory.newDisciplineMap();
	touchstonesAndConvictions: string[] = [];

	// properties with custom setters
	private _health: number = 0;
	private _willpower: number = 0;
	private _hunger: number = 0;
	private _humanity: number = 0;
	private _bloodPotency: number = 0;
	private _name: string = '';
	private _clan: string = '';

	public set hunger(val: number) {}

	constructor(sheet: iCharacterSheet) {
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

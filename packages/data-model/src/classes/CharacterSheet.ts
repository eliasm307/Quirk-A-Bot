import { AttributeMap, SkillMap, DisciplineMap } from './../declarations/types';
import { iAttribute, iCharacterSheet, iCharacterSheetModel, iDiscipline, iSkill } from '../declarations/interfaces';
import fs, { WriteOptions } from 'fs-extra';
import TypeFactory from './TypeFactory';
export default class CharacterSheet implements iCharacterSheet {
	readonly discordUserId: number;

	//-------------------------------------
	// properties with custom setters
	private _health: number = 0;
	private _willpower: number = 0;
	private _hunger: number = 0;
	private _humanity: number = 0;
	private _bloodPotency: number = 0;
	private _name: string = '';
	private _clan: string = '';
	private _sire: string = '';
	private _attributes: AttributeMap = TypeFactory.newAttributeMap();
	private _skills: SkillMap = TypeFactory.newSkillMap();
	private _disciplines: DisciplineMap = TypeFactory.newDisciplineMap();
	private _touchstonesAndConvictions: string[] = [];

	//-------------------------------------
	// BASIC VARIABLE GETTERS AND SETTERS
	public set health(newVal: number) {
		this._health = newVal;
	}
	public set willpower(newVal: number) {}
	public set hunger(newVal: number) {}
	public set humanity(newVal: number) {}
	public set bloodPotency(newVal: number) {}
	public set name(newVal: string) {}
	public set clan(newVal: string) {}
	public set sire(newVal: string) {}

	//-------------------------------------
	// ATTRIBUTES
	public get attributes(): iAttribute[] {
		return Array.from(this._attributes.values());
	}

	public getAttributeByName(name: string): iAttribute | null {
		return this._attributes.has(name) ? (this._attributes.get(name) as iAttribute) : null;
	}

	//-------------------------------------
	// SKILLS
	public get skills(): iSkill[] {
		return Array.from(this._skills.values());
	}

	//-------------------------------------
	// DISCIPLINES
	public get disciplines(): iDiscipline[] {
		return Array.from(this._disciplines.values());
	}

	//-------------------------------------
	// TOUCHSTONES AND CONVICTIONS
	public get touchstonesAndConvictions(): string[] {
		return [...this._touchstonesAndConvictions];
	}

	//-------------------------------------
	// CONSTRUCTOR
	constructor(sheet: iCharacterSheet | number) {
		if (typeof sheet === 'number') {
			this.discordUserId = sheet;
		} else if (typeof sheet === 'object') {
			this.discordUserId = sheet.discordUserId;
			// todo add other variables
		} else {
			throw `constructor argument not defined`;
		}
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

import { iCharacterSheetData } from '../declarations/interfaces/character-sheet-interfaces';
import { iTraitData } from '../declarations/interfaces/trait-interfaces';
import {  TraitNameDynamic } from './../declarations/types';
export default abstract class TypeFactory {
	/*
	static newTraitMap<N extends TraitNameUnionOrString>(...args: T[]): TraitMap<T> {
		return new Map<TraitName<T>, T>(args.map(e => [e.name as TraitName<T>, e]));
	}*/
	/*	static newiCharacterSheetObject(): iCharacterSheetData {
		return {
			attributes: [],
			bloodPotency: 0,
			clan: '',
			disciplines: [],
			discordUserId: 0,
			health: 0,
			humanity: 0,
			hunger: 0,
			name: '',
			sire: '',
			skills: [],
			touchstonesAndConvictions: [],
			willpower: 0,
		};
	}*/
}

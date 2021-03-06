import { iCharacterSheetData } from './character-sheet-interfaces';
import { TraitNameUnionOrString } from './../types';
import { TraitValueTypeUnion } from '../types';
import { iGeneralTrait, iGeneralTraitData } from './trait-interfaces';

/** The base data storage object instance  +shape */
export interface iBaseDataStorage {
	save(): void;
}

export interface iTraitDataStorage<V> extends iBaseDataStorage {
	get(): V;
	set(newValue: V): void;
}

export interface iTraitCollectionDataStorage<
	N extends TraitNameUnionOrString, 
	D extends iGeneralTraitData
> extends iBaseDataStorage {
	get(name: N): D | void; 
	delete(name: N): void;
	has(name: N): boolean;
	toArray(): D[];
	readonly size: number;
}

export interface iCharacterSheetDataStorage  extends iBaseDataStorage {
	get(): iCharacterSheetData; 
}

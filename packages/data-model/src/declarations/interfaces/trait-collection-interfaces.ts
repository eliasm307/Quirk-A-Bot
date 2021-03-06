import { AttributeName, SkillName, DisciplineName, CoreStringTraitName, CoreNumberTraitName } from './../types';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../types';
import { iToJson } from './general-interfaces';
import { iLoggerSingle, iLoggerCollection } from './log-interfaces';
import {
	iAttribute,
	iBaseTrait,
	iSkill,
	iTraitData,
	iDiscipline,
	iTouchStoneOrConviction,
	iAttributeData,
	iDisciplineData,
	iSkillData,
	iTouchStoneOrConvictionData,
	iBaseStringTrait,
	iStringTraitData,
	iCoreStringTraitData,
	iCoreStringTrait,
	iCoreNumberTrait,
	iCoreNumberTraitData,
	iGeneralTraitData,
	iGeneralTrait,
} from './trait-interfaces';

// -------------------------------------------------------
// BASE TRAIT COLLECTION TYPES

/** Shape of a custom trait collection with logging */
export interface iTraitCollection<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends iToJson<D[]>,
		iLoggerCollection {
	name: string;
	get(name: N): T | void;
	set(name: N, value: V): void;
	delete(name: N): void;
	has(name: N): boolean;
	toArray(): T[];
	readonly size: number;
} // todo create a base iCollection so data-storage trait collection can extend the same methods

// -------------------------------------------------------
// SPECIFIC TRAIT COLLECTION TYPES

export interface iGeneralTraitCollection
	extends iTraitCollection<TraitNameUnionOrString, TraitValueTypeUnion, iGeneralTraitData, iGeneralTrait> {}

export interface iAttributeTraitCollection
	extends iTraitCollection<AttributeName, number, iAttributeData, iAttribute> {}

export interface iSkillTraitCollection extends iTraitCollection<SkillName, number, iSkillData, iSkill> {}

export interface iDisciplineTraitCollection
	extends iTraitCollection<DisciplineName, number, iDisciplineData, iDiscipline> {}

export interface iTouchStoneOrConvictionCollection
	extends iTraitCollection<string, string, iTouchStoneOrConvictionData, iTouchStoneOrConviction> {}

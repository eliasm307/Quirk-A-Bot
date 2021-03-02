import { AttributeName, SkillName, DisciplineName } from './../types';
// -------------------------------------------------------
// TRAIT COLLECTION

import {
	TraitNameUnionOrString,
	TraitValueTypeUnion,
	TraitDataDynamic,
	TraitNameDynamic,
	TraitValueDynamic,
} from '../types';
import { iToJson } from './general-interfaces';
import { iLogger } from './log-interfaces';
import { iAttribute, iBaseTrait, iSkill, iTraitData, iDiscipline, iTouchStoneOrConviction } from './trait-interfaces';

// todo is this the best way to do this?
// todo use dynamic types here?
export interface iTraitCollection<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	T extends iBaseTrait<N, V>
> extends iToJson<iTraitData<N, V>[]>,
		iLogger {
	get(name: N): T | void;
	set(name: N, value: V): void;
	delete(name: N): void;
	has(name: N): boolean;
	readonly size: number;
}

// -------------------------------------------------------
// SPECIFIC TRAIT COLLECTION TYPES

export interface iAttributeTraitCollection extends iTraitCollection<AttributeName, number, iAttribute> {}

export interface iSkillTraitCollection extends iTraitCollection<SkillName, number, iSkill> {}

export interface iDisciplineTraitCollection extends iTraitCollection<DisciplineName, number, iDiscipline> {}

export interface iTouchStoneOrConvictionCollection extends iTraitCollection<string, string, iTouchStoneOrConviction> {}

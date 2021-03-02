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
import { iBaseTrait, iTraitData } from './trait-interfaces';

// todo is this the best way to do this?
// todo use dynamic types here?
export interface iTraitCollection<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends iToJson<D[]>,
		iLogger {
	get(name: N): T | void;
	set(name: N, value: V): void;
	delete(name: N): void;
	has(name: N): boolean;
	readonly size: number;
}

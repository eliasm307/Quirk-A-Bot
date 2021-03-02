// -------------------------------------------------------
// TRAIT COLLECTION

import { TraitNameUnionOrString, TraitValueTypeUnion, TraitDataDynamic, TraitNameDynamic, TraitValueDynamic } from "../types";
import { iToJson } from "./general-interfaces";
import { iBaseTrait } from "./trait-interfaces";

// todo is this the best way to do this?
// todo use dynamic types here?
export interface iTraitCollection<T extends iBaseTrait<TraitNameUnionOrString, TraitValueTypeUnion>>
	extends iToJson<TraitDataDynamic<T>[]> {
	get(name: TraitNameDynamic<T>): T | void;
	set(name: TraitNameDynamic<T>, value: TraitValueDynamic<T>): void;
	delete(name: TraitNameDynamic<T>): void;
	has(name: TraitNameDynamic<T>): boolean;
	readonly size: number;
}

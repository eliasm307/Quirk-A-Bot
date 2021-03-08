import { iNumberTrait, iNumberTraitData } from '../../declarations/interfaces/trait-interfaces';
import { iNumberTraitProps } from '../../declarations/interfaces/trait-interfaces';
import { TraitNameUnionOrString } from '../../declarations/types';
import AbstractNumberTrait from './AbstractNumberTrait';

/** class with behaviour for traits that have number values */
export default class NumberTrait<N extends TraitNameUnionOrString>
	extends AbstractNumberTrait<N, iNumberTraitData<N>>
	implements iNumberTrait<N> {
	constructor({
		max,
		name,
		min = 0,
		value = min,
		traitDataStorageInitialiser,
		toJson = () => ({
			name: this.name,
			value: this.value,
		}),
	}: iNumberTraitProps<N>) {
		super({
			name,
			value,
			traitDataStorageInitialiser,
			toJson,
			min,
			max,
		});
	}
}

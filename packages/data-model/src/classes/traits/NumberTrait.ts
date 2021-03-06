import { iNumberTrait, iNumberTraitData } from '../../declarations/interfaces/trait-interfaces';
import { iNumberTraitProps } from '../../declarations/interfaces/trait-interfaces';
import { TraitNameUnionOrString } from '../../declarations/types';
import AbstractNumberTrait from './AbstractNumberTrait';

/** class with behaviour for traits that have number values */
export default class NumberTrait<N extends TraitNameUnionOrString>
	extends AbstractNumberTrait<N, iNumberTraitData<N>>
	implements iNumberTrait<N> {
	
	// todo move toJson file to external utility?
	constructor({
		max,
		name,
		value = 0,
		min = 0,
		dataStorageInitialiser,
		toJson = () => ({
			name: this.name,
			value: this.value,
		}),
	}: iNumberTraitProps<N>) {
		super({
			name,
			value,
			dataStorageInitialiser,
			toJson,
			min,
			max,
		});
	}
}

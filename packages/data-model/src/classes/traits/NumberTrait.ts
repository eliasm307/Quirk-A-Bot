import { iNumberTrait, iNumberTraitData } from './interfaces/trait-interfaces';
import { iNumberTraitProps } from './interfaces/trait-interfaces';
import { TraitNameUnionOrString } from '../../declarations/types';
import AbstractNumberTrait from './AbstractNumberTrait';

/** class with behaviour for traits that have number values */
export default class NumberTrait<N extends TraitNameUnionOrString>
	extends AbstractNumberTrait<N, iNumberTraitData<N>>
	implements iNumberTrait<N> {
	constructor({
		min = 0,
		value = min,
		toJson = () => ({
			name: this.name,
			value: this.value,
		}),
		...restProps
	}: iNumberTraitProps<N>) {
		super({
			...restProps,
			value,
			toJson,
			min,
		});
	}
}

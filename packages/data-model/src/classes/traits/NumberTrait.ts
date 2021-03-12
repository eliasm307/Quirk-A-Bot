import { TraitNameUnionOrString } from '../../declarations/types';
import AbstractNumberTrait from './AbstractNumberTrait';
import { iNumberTrait, iNumberTraitData, iNumberTraitProps } from './interfaces/trait-interfaces';

/** class with behaviour for traits that have number values */
export default class NumberTrait<N extends TraitNameUnionOrString>
	extends AbstractNumberTrait<N, iNumberTraitData<N>>
	implements iNumberTrait<N> {
	constructor({
		min = 0,
		value = min,
		data: toJson = () => ({
			name: this.name,
			value: this.value,
		}),
		...restProps
	}: iNumberTraitProps<N>) {
		super({
			...restProps,
			value,
			data: toJson,
			min,
		});
	}
}

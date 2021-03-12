import { TraitNameUnionOrString } from '../../declarations/types';
import AbstractNumberTrait from './AbstractNumberTrait';
import {
  iNumberTraitData, iNumberTraitWithCategory, iNumberTraitWithCategoryProps
} from './interfaces/trait-interfaces';

/** class with behaviour for traits that have number values and categories */
export default class NumberTraitWithCategory<N extends TraitNameUnionOrString, C extends string>
	extends AbstractNumberTrait<N, iNumberTraitData<N>>
	implements iNumberTraitWithCategory<N, C> {
	readonly category: C;

	#categorySelector: (name: N) => C;

	constructor({
		min = 0,
		value = min,
		categorySelector,
		data: toJson = () => ({
			name: this.name,
			value: this.value,
		}),
		...restProps
	}: iNumberTraitWithCategoryProps<N, C>) {
		super({ ...restProps, value, min, data: toJson });

		// get the input categorySelector
		this.#categorySelector = categorySelector;

		// get category from name
		this.category = this.#categorySelector(this.name);
	}
}

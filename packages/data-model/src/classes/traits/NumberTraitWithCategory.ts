import { TraitNameUnion } from './../../declarations/types';
import {
	iNumberTraitWithCategory,
	iNumberTraitWithCategoryProps,
} from '../../declarations/interfaces/trait-interfaces';
import NumberTrait from './NumberTrait';

export default class NumberTraitWithCategory<N extends TraitNameUnionOrString, C extends string>
	extends NumberTrait<N>
	implements iNumberTraitWithCategory<C> {
	readonly category: C;

	#categorySelector: (name: N) => C;

	constructor(props: iNumberTraitWithCategoryProps<N, C>) {
		super(props);

		// get the input categorySelector
		this.#categorySelector = props.categorySelector;

		// get category from name
		this.category = this.#categorySelector(this.name);
	}
}

import { iNumberTrait } from './../../declarations/interfaces/trait-interfaces';
import {
	iNumberTraitProps,
	iBaseTrait,
	iHasNumberValue,
	iTraitData,
} from '../../declarations/interfaces/trait-interfaces';
import { TraitNameUnion, TraitNameUnionOrString, TraitValueDynamic } from '../../declarations/types';
import AbstractBaseTrait from './AbstractBaseTrait';

/** class with behaviour for traits that have number values */
export default class NumberTrait<N extends TraitNameUnionOrString>
	extends AbstractBaseTrait<N, number>
	implements iNumberTrait<N> {
	min: number;
	max: number;

	constructor(props: iNumberTraitProps<N>) {
		super(props);
		const { min = 0, max } = props; // min defaults to 0
		this.min = min;
		this.max = max;
	}

	/** Only allows setting numbers within the allowed range for this trait */
	newValueIsValid(newVal: number): boolean {
		// assert value is a number
		if (typeof newVal !== 'number')
			throw Error(`Value for trait ${this.name} should be a number, received a "${typeof newVal}`);

		// todo use rounded value
		// const roundedVal: TraitValue<T> = typeof newVal === 'number' ?  Math.round(newVal) : newVal;

		// make sure number is within allowable range before change
		if (newVal < this.min) {
			console.error(
				`Cannot set trait ${this.name} to ${newVal}, this is below the minimum allowed value of ${this.min}`
			);
			return false;
		}
		if (newVal > this.max) {
			console.error(
				`Cannot set trait ${this.name} to ${newVal}, this is above the maximum allowed value of ${this.max}`
			);
			return false;
		}

		// todo round the value to an integer
		return true;
	}
}

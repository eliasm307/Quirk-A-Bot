import {
	iBaseNumberTrait,
	iBaseNumberTraitProps,
	iNumberTrait,
	iNumberTraitData,
} from '../../declarations/interfaces/trait-interfaces';
import {
	iNumberTraitProps,
	iBaseTrait,
	iHasNumberValue,
	iTraitData,
} from '../../declarations/interfaces/trait-interfaces';
import { TraitNameUnion, TraitNameUnionOrString, TraitValueDynamic } from '../../declarations/types';
import AbstractBaseTrait from './AbstractBaseTrait';

/** class with behaviour for traits that have number values */
export default abstract class AbstractNumberTrait<N extends TraitNameUnionOrString, D extends iNumberTraitData<N>>
	extends AbstractBaseTrait<N, number, D>
	implements iBaseNumberTrait<N, D> {
	min: number;
	max: number;

	// todo move toJson file to external utility?
	constructor({ max, name, value = 0, min = 0, saveAction, toJson }: iBaseNumberTraitProps<N, D>) {
		super({
			name,
			value,
			saveAction,
			toJson,
		});
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
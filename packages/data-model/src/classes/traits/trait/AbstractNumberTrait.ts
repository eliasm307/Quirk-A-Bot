import { TraitNameUnionOrString } from '../../../declarations/types';
import {
  iAbstractNumberTraitProps, iBaseNumberTrait, iNumberTraitData
} from '../interfaces/trait-interfaces';
import AbstractBaseTrait from './AbstractBaseTrait';

/** class with behaviour for traits that have number values */
export default abstract class AbstractNumberTrait<N extends TraitNameUnionOrString, D extends iNumberTraitData<N>>
	extends AbstractBaseTrait<N, number, D>
	implements iBaseNumberTrait<N, D> {
	max: number;
	min: number;

	constructor({ min = 0, max, value = min, ...restProps }: iAbstractNumberTraitProps<N, D>) {
		super({
			...restProps,
			value,
		});
		this.min = min;
		this.max = max;
	}

	/** Only allows setting numbers within the allowed range for this trait */
	newValueIsValid(newVal: number): boolean {
		// ? is this required? delete
		/*
		// assert value is a number
		if (typeof newVal !== 'number')
      throw Error( `Value for trait ${ this.name } should be a number, received a "${ typeof newVal }` );
    */

		// make sure number is within allowable range before change
		if (newVal < this.min) {
			// console.log(`Cannot set trait ${this.name} to ${newVal}, this is below the minimum allowed value of ${this.min}`);
			return false;
		}
		if (newVal > this.max) {
			// console.log(`Cannot set trait ${this.name} to ${newVal}, this is above the maximum allowed value of ${this.max}`);
			return false;
		}

		return true;
	}

	preProcessValue(newValueRaw: number): number {
		// number values to be rounded before being used
		return Math.round(newValueRaw);
	}
}

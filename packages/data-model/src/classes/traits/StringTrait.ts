import {
	iAbstractNumberTraitProps,
	iBaseTrait,
	iNumberValue,
	iStringTrait,
	iTraitData,
} from '../../declarations/interfaces/trait-interfaces';
import { TraitValue } from '../../declarations/types';
import BaseTrait from './BaseTrait';

/** class with behaviour for traits that have string values */
export default class StringTrait<N extends TraitNameUnion> extends BaseTrait<T> implements iStringTrait {
	/** Only allows setting non-empty strings */
	newValueIsValid(newVal: TraitValue<T>): boolean {
		// assert value is a number
		if (typeof newVal !== 'string') {
			throw Error(`Value for trait ${this.name} should be a string, received a "${typeof newVal}`);
		}

		// make sure string has content before change
		if (!newVal) {
			console.error(`Cannot set trait ${this.name} to "${newVal}", text cannot be empty`);
			return false;
		}

		return true;
	}
}

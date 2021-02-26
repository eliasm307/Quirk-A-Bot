import { iAbstractNumberTraitProps, iBaseTrait, iNumberValue, iTraitData } from '../../declarations/interfaces';
import { TraitValue } from '../../declarations/types';
import BaseTrait from './BaseTrait';

/** class with behaviour for traits that have string values */
export default class AbstractStringTrait<T extends iTraitData> extends BaseTrait<T> implements iBaseTrait {
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

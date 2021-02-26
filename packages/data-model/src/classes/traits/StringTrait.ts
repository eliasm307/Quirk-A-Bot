import { iStringTrait, iStringTraitProps } from '../../declarations/interfaces/trait-interfaces';
import { TraitNameUnion } from '../../declarations/types';
import AbstractBaseTrait from './AbstractBaseTrait';

/** class with behaviour for traits that have string values */
export default class StringTrait<N extends TraitNameUnion> extends AbstractBaseTrait<N, string> implements iStringTrait {
	constructor(props: iStringTraitProps<N>) {
		super(props);
	}

	/** Only allows setting non-empty strings */
	newValueIsValid(newVal: string): boolean {
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

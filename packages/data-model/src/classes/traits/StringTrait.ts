import { iStringTraitData } from './../../declarations/interfaces/trait-interfaces';
import { iBaseStringTrait, iStringTraitProps } from '../../declarations/interfaces/trait-interfaces';
import { TraitNameUnion, TraitNameUnionOrString } from '../../declarations/types';
import AbstractBaseTrait from './AbstractBaseTrait';

/** class with behaviour for traits that have string values */
export default class StringTrait<N extends TraitNameUnionOrString, V extends string>
	extends AbstractBaseTrait<N, V, iStringTraitData<N, V>>
	implements iBaseStringTrait<N, V> {
	constructor({ name, value, saveAction }: iStringTraitProps<N, V>) {
		super({
			name,
			value,
			saveAction,
			toJson: () => ({
				name: this.name,
				value: this.value,
			}),
		});
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

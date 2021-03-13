import { TraitNameUnionOrString } from '../../declarations/types';
import AbstractBaseTrait from './AbstractBaseTrait';
import {
  iBaseStringTrait, iStringTraitData, iStringTraitProps
} from './interfaces/trait-interfaces';

/** class with behaviour for traits that have string values */
export default class StringTrait<N extends TraitNameUnionOrString, V extends string>
	extends AbstractBaseTrait<N, V, iStringTraitData<N, V>>
	implements iBaseStringTrait<N, V> {
  constructor(props: iStringTraitProps<N, V>) {
		super({
			...props,
			data: () => ({
				name: this.name,
				value: this.value,
			}),
		});
	}

  /** Only allows setting non-empty strings */
  protected newValueIsValid(newVal: string): boolean {
		// assert value is a number
    /* ? delete
		if (typeof newVal !== 'string') {
			throw Error(`Value for trait ${this.name} should be a string, received a "${typeof newVal}`);
    }
    */

		// make sure string has content before change
		if (!newVal) {
			console.error(`Cannot set trait ${this.name} to "${newVal}", text cannot be empty`);
			return false;
		}

		return true;
	}

  protected preProcessValue(newValueRaw: V): V {
		// no pre processing for string values
		return newValueRaw;
	}
}

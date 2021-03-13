import { TraitNameUnionOrString } from '../../../declarations/types';
import {
  iBaseStringTrait, iStringTraitData, iStringTraitProps
} from '../interfaces/trait-interfaces';
import AbstractBaseTrait from './AbstractBaseTrait';

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

	protected newValueIsValid(newVal: string): boolean {
		// only allows string types (empty strings also), which is handled by typescript
		return true;
	}

	protected preProcessValue(newValueRaw: V): V {
		// no pre processing for string values
		return newValueRaw;
	}
}

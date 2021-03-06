import { TraitNameUnionOrString } from './../../declarations/types';
import { TraitValueTypeUnion } from '../../declarations/types';
import {
	iInMemoryTraitDataStorageProps,
} from '../../declarations/interfaces/data-storage-interfaces';
import AbstractTraitDataStorage from './AbstractTraitDataStorage';

// ? does this need to be a separate interface
interface iPrivateModifiableProperties<V extends TraitValueTypeUnion> {
	value: V;
}

export default class InMemoryTraitDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion
> extends AbstractTraitDataStorage<N, V> {
	#private: iPrivateModifiableProperties<V>;

	readonly name: N;

	constructor(props: iInMemoryTraitDataStorageProps<N, V>) {
		super();

		const {   name, defaultValueIfNotDefined  } = props;

		this.name = name;

		this.#private = {
			value: defaultValueIfNotDefined, // save initial value or default value if initial is not defined
		};
	}

	// ? should this be able to return undefined?
	get value(): V {
		return this.#private.value;
	}
	set value(newValue: V) {
		// get current value as old value
		const oldValue = this.#private.value;

		// do nothing if values are the same
		if (newValue === oldValue) return;

		// update internal value
		this.#private.value = newValue;

		// save change
		this.save();

		// attempt autosave for change
		this.save()
			? console.warn(__filename, `Successfully saved "${this.name}" trait property change`, { oldValue, newValue })
			: console.error(__filename, `Error while saving "${this.name}" trait property change`, { oldValue, newValue });
	}
	save(): boolean {
		// always true as data is saved in memory
		return true;
	}
}

import { iTraitDataStorage } from './../../../declarations/interfaces/data-storage-interfaces';
import { throws } from 'node:assert';
import { iInMemoryTraitDataStorageProps } from '../../../declarations/interfaces/data-storage-interfaces';
import { TraitValueTypeUnion, TraitNameUnionOrString } from '../../../declarations/types';
import AbstractTraitDataStorage from '../AbstractTraitDataStorage';

// ? does this need to be a separate interface
interface iPrivateModifiableProperties<V extends TraitValueTypeUnion> {
	value: V;
}

export default class InMemoryTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends AbstractTraitDataStorage<N, V>
	implements iTraitDataStorage<N, V> {
	#private: iPrivateModifiableProperties<V>;

	readonly name: N;

	constructor ( props: iInMemoryTraitDataStorageProps<N, V> ) {
		super()
		const { name, defaultValueIfNotDefined } = props;

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

		this.save();
	}

	protected save(): boolean {
		return true;
	}
}

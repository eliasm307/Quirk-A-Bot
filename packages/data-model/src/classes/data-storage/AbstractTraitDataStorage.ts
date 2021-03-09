import { TraitNameUnionOrString } from './../../declarations/types';
import { TraitValueTypeUnion } from '../../declarations/types';
import { iBaseTraitDataStorageProps, iTraitDataStorage } from '../../declarations/interfaces/data-storage-interfaces';

interface iPrivateModifiableProperties<V extends TraitValueTypeUnion> {
	value: V;
}

export default abstract class AbstractTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	implements iTraitDataStorage<N, V> {
	name: N;
	protected private: iPrivateModifiableProperties<V>;

	constructor({ name, defaultValueIfNotDefined }: iBaseTraitDataStorageProps<N, V>) {
		this.name = name;
		this.private = {
			value: defaultValueIfNotDefined, // assign initial value
		};
	}

	get value(): V {
		return this.private.value;
	}

	set value(newValue: V) {
		// get current value as old value
		const oldValue = this.private.value;

		// do nothing if value hasnt changed
		if (newValue === oldValue) return;

		// update internal value
		this.private.value = newValue;

    // run any custom logic after internal value is changed
		this.afterValueChange();
	}

	protected abstract afterValueChange(): void;
}

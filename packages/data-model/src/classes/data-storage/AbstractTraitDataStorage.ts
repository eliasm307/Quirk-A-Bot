import { iBaseTraitData } from './../../declarations/interfaces/trait-interfaces';
import { TraitNameUnionOrString } from './../../declarations/types';
import { TraitValueTypeUnion } from '../../declarations/types';
import {
	iBaseTraitDataStorageProps,
	iBaseTraitDataStorage,
} from '../../declarations/interfaces/data-storage-interfaces';
import { iTraitLogger } from '../../declarations/interfaces/log-interfaces';

interface iPrivateModifiableProperties<V extends TraitValueTypeUnion> {
	value: V;
}

export default abstract class AbstractTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	implements iBaseTraitDataStorage<N, V> {
	name: N;
	log: iTraitLogger;
	protected private: iPrivateModifiableProperties<V>;

	constructor(props: iBaseTraitDataStorageProps<N, V>) {
		const { name, defaultValueIfNotDefined } = props;
		this.name = name;
		this.private = {
			value: defaultValueIfNotDefined, // assign initial value
		};
 
		// initialise log collection
	 this.log = new TraitLogger({ sourceType: 'Trait', sourceName: this.name });
	}

	// the specific data storage defines this
	abstract path: string;

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
		this.afterValueChange(oldValue, newValue);
	}

	protected abstract afterValueChange(oldValue: V, newValue: V): void;
}

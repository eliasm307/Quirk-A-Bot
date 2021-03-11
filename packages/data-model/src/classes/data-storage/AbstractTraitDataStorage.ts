import {
  iBaseTraitDataStorage, iBaseTraitDataStorageProps
} from '../../declarations/interfaces/data-storage-interfaces';
import { iTraitLogReporter } from '../../declarations/interfaces/log-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../declarations/types';

interface iPrivateModifiableProperties<V extends TraitValueTypeUnion> {
  value: V;
}

export default abstract class AbstractTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	implements iBaseTraitDataStorage<N, V> {
  protected private: iPrivateModifiableProperties<V>;

  log: iTraitLogReporter;
  name: N;
  // the specific data storage defines this
  abstract path: string;

  protected abstract afterValueChange(oldValue: V, newValue: V): void;

  constructor(props: iBaseTraitDataStorageProps<N, V>) {
		const { name, defaultValueIfNotDefined } = props;
		this.name = name;
		this.private = {
			value: defaultValueIfNotDefined, // assign initial value
		};
 
		// initialise log collection
	 this.log = new TraitLogger({ sourceType: 'Trait', sourceName: this.name });
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
		this.afterValueChange(oldValue, newValue);
	}
}

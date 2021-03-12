import {
  iBaseTraitDataStorage, iBaseTraitDataStorageProps
} from '../../declarations/interfaces/data-storage-interfaces';
import { iTraitLogger, iTraitLogReporter } from '../../declarations/interfaces/log-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../declarations/types';
import TraitLogger from '../log/TraitLogger';
import UpdateLogEvent from '../log/UpdateLogEvent';

interface iPrivateModifiableProperties<V extends TraitValueTypeUnion> {
	value: V;
}

export default abstract class AbstractTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	implements iBaseTraitDataStorage<N, V> {
	protected logger: iTraitLogger;
	protected private: iPrivateModifiableProperties<V>;

	log: iTraitLogReporter;
	name: N;
	// the specific data storage defines this
	abstract path: string;

	protected abstract afterValueChange(oldValue: V, newValue: V): void;

	constructor(props: iBaseTraitDataStorageProps<N, V>) {
		const { name, defaultValueIfNotDefined, parentPath, logger } = props;
		this.name = name;
		this.private = {
			value: defaultValueIfNotDefined, // assign initial value
		};

		// initialise logging, use logger if provided or create a new one
		this.logger = logger ? logger({ sourceName: name }) : new TraitLogger({ sourceName: name, parentLogHandler: null });

		// expose logger reporter
		this.log = this.logger.reporter;
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

		// log change
		this.logger.log(new UpdateLogEvent({ property: this.name, oldValue, newValue }));

		// run any custom logic after internal value is changed
		this.afterValueChange(oldValue, newValue);
	}
}

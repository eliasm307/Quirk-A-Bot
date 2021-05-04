import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../declarations/types';
import { iTraitLogger, iTraitLogReporter } from '../log/interfaces/log-interfaces';
import UpdateLogEvent from '../log/log-events/UpdateLogEvent';
import TraitLogger from '../log/loggers/TraitLogger';
import { iBaseTraitData } from '../traits/interfaces/trait-interfaces';
import { iBaseTraitDataStorage } from './interfaces/data-storage-interfaces';
import { iBaseTraitDataStorageProps } from './interfaces/props/trait-data-storage';

interface iPrivateModifiableProperties<V extends TraitValueTypeUnion> {
  value: V;
}

export default abstract class AbstractTraitDataStorage<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion
> implements iBaseTraitDataStorage<N, V> {
  protected logger: iTraitLogger;
  protected private: iPrivateModifiableProperties<V>;

  log: iTraitLogReporter;
  name: N;
  // the specific data storage defines this
  abstract path: string;

  abstract cleanUp(): boolean;

  protected abstract afterValueChange(oldValue: V, newValue: V): Promise<void>;

  constructor(props: iBaseTraitDataStorageProps<N, V>) {
    const {
      name,
      defaultValueIfNotDefined,
      parentPath,
      loggerCreator: logger,
    } = props;
    this.name = name;
    this.private = {
      value: defaultValueIfNotDefined, // assign initial value
    };

    // initialise logger
    this.logger = logger
      ? logger({ sourceName: name })
      : new TraitLogger({ sourceName: name, parentLogHandler: null });

    // expose logger reporter
    this.log = this.logger.reporter;
  }

  get value(): V {
    return this.private.value;
  }

  data: () => iBaseTraitData<N, V> = () => ({
    name: this.name,
    value: this.value,
  });

  async setValue(newValueResolver: V | ((oldValue: V) => V)) {
    // get current value as old value
    const oldValue = this.private.value;

    // resolve new value
    const newValue =
      typeof newValueResolver === "function"
        ? newValueResolver(oldValue)
        : newValueResolver;

    // do nothing if value hasn't changed
    if (newValue === oldValue) return;

    // update internal value
    this.private.value = newValue;

    // log change
    this.logger.log(
      new UpdateLogEvent({ property: this.name, oldValue, newValue })
    );

    // run any custom logic after internal value is changed
    await this.afterValueChange(oldValue, newValue);
  }
}

import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../declarations/types';
import {
  iAddLogEventProps, iChildLoggerCreatorProps, iDeleteLogEventProps, iTraitCollectionLogger,
  iTraitCollectionLogReporter,
} from '../log/interfaces/log-interfaces';
import AddLogEvent from '../log/log-events/AddLogEvent';
import DeleteLogEvent from '../log/log-events/DeleteLogEvent';
import TraitCollecitonLogger from '../log/loggers/TraitCollectionLogger';
import { iBaseTrait, iBaseTraitData, iBaseTraitProps } from '../traits/interfaces/trait-interfaces';
import {
  iBaseTraitDataStorage, iTraitCollectionDataStorage,
} from './interfaces/data-storage-interfaces';
import {
  iBaseTraitCollectionDataStorageProps,
} from './interfaces/props/trait-collection-data-storage';
import { iBaseTraitDataStorageProps } from './interfaces/props/trait-data-storage';
import { createPath } from './utils/createPath';

// todo break this up

export default abstract class AbstractTraitCollectionDataStorage<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion,
  D extends iBaseTraitData<N, V>,
  T extends iBaseTrait<N, V, D>
> implements iTraitCollectionDataStorage<N, V, D, T> {
  protected afterAddCustom?: (props: iAddLogEventProps<V>) => void;
  // ? is this required
  protected afterDeleteCustom?: (props: iDeleteLogEventProps<V>) => void;
  // ? is this required
  protected logger: iTraitCollectionLogger;
  protected map: Map<N, T> = new Map<N, T>();
  protected abstract newTraitDataStorage: (
    props: iBaseTraitDataStorageProps<N, V>
  ) => iBaseTraitDataStorage<N, V>;

  instanceCreator: (props: iBaseTraitProps<N, V, D>) => T;
  log: iTraitCollectionLogReporter;
  name: string;
  path: string;

  // ? is this required? if colleciton adds data to storage this means creating trait data and connecting data to trait instances would be done by 2 classes async, so it might be done in the wrong order. Opted to have these both on the trait side
  protected abstract afterAddInternal(name: N): void;
  /** Run after the child traits have been cleaned, this is for cleaning up trait collection itself */
  protected abstract afterTraitCleanUp(): boolean;
  protected abstract deleteTraitFromDataStorage(name: N): Promise<void>;

  constructor({
    instanceCreator,
    name: collectionName,
    onAdd,
    onDelete,
    initialData,
    parentPath,
    loggerCreator: logger,
  }: iBaseTraitCollectionDataStorageProps<N, V, D, T>) {
    // save local values
    this.afterAddCustom = onAdd;
    this.afterDeleteCustom = onDelete;
    this.name = collectionName;
    this.instanceCreator = instanceCreator;

    // create path // ? should this be done by the concrete implementations?
    this.path = createPath(parentPath, collectionName);

    // use logger if provided, otherwise create a local one
    this.logger = logger
      ? logger({ sourceName: collectionName })
      : new TraitCollecitonLogger({
          sourceName: collectionName,
          parentLogHandler: null,
        });

    // expose logger reporter
    this.log = this.logger.reporter;

    const traitLoggerCreator = (props: iChildLoggerCreatorProps) =>
      this.logger.createChildTraitLogger(props);

    // assign initial data
    /*
    if (initialData)
      initialData.forEach(({ name, value }) =>
        this.map.set(name, this.createTraitInstance(name, value))
      );
      */
  }

  get size(): number {
    return this.map.size;
  }

  cleanUp(): boolean {
    let result = true;

    // try cleaning traits
    this.map.forEach((trait) => {
      if (!trait.cleanUp()) {
        console.warn(
          `Issue cleaning up trait "${trait.name}" in collection "${this.name}"`
        );
        result = false;
      }
    });

    // try cleaning this colleciton instance
    if (!this.afterTraitCleanUp()) {
      console.warn(
        `Issue cleaning up collection "${
          this.name
        }" after child traits were cleaned ${
          result ? "successfully" : "unsuccessfully"
        }`
      );
      result = false;
    }

    return result;
  }

  data(): D[] {
    return this.toArray().map((e) => e.data());
  }

  async delete(name: N): Promise<iTraitCollectionDataStorage<N, V, D, T>> {
    if (!this.map.has(name)) {
      /*
      console.log(
        __filename,
        `Cannot delete property "${name}" from "${this.name}" trait collection as it doesnt exist in the collection`
      );
      */
      return this; // return this instance for chaining
    }

    const oldValue = this.map.get(name)!.value;

    if (typeof oldValue !== "undefined") {
      // ? do this as an abstract beforeDelete method, so specific classes can do what they want? Whats the difference?
      // do any cleanup on the trait before deleting
      const deatTraitWalking = this.map.get(name);
      if (deatTraitWalking) deatTraitWalking.cleanUp();

      // apply change locally
      this.map.delete(name);

      // apply change to data storage
      await this.deleteTraitFromDataStorage(name);

      // log change
      this.logger.log(new DeleteLogEvent({ oldValue, property: name }));

      // do any custom after delete action
      if (this.afterDeleteCustom)
        this.afterDeleteCustom({ oldValue, property: name }); // ? is this required if logging is done here?
    } else {
      console.error(
        __filename,
        `old value was "${oldValue as string}" when deleting property "${name}"`
      );
    }

    return this; // return this instance for chaining
  }

  get(key: N): T | void {
    return this.map.get(key);
  }

  has(name: N): boolean {
    return this.map.has(name);
  }

  async set(
    name: N,
    newValue: V
  ): Promise<iTraitCollectionDataStorage<N, V, D, T>> {
    // if trait already exists then just update it
    if (this.map.has(name)) {
      const trait = this.map.get(name);

      if (!trait) {
        console.error(
          __filename,
          `{this.#typeName} with name '${name}' is not defined but key exists`
        );
        return this; // return this instance for chaining
      }

      // apply change
      // NOTE traits will handle changes internally, no need to do anything here
      trait.value = newValue;
    } else {
      // add new trait instance locally, instantiating new trait will assert that it exists
      this.map.set(name, this.createTraitInstance(name, newValue));

      // log change
      this.logger.log(new AddLogEvent({ newValue, property: name }));

      // ? is this required
      // post add event
      this.afterAddInternal(name);

      if (this.afterAddCustom)
        this.afterAddCustom({ newValue, property: name }); // ? is this required
    }

    return this; // return this instance for chaining
  }

  toArray(): T[] {
    return Array.from(this.map.values());
  }

  protected createTraitInstance(name: N, defaultValue: V) {
    // return existing instance or new instance
    return (
      this.map.get(name) ||
      this.instanceCreator({
        name,
        value: defaultValue,
        parentPath: this.path,
        traitDataStorageInitialiser: (props) => this.newTraitDataStorage(props),
        loggerCreator: (props: iChildLoggerCreatorProps) =>
          this.logger.createChildTraitLogger(props), // NOTE this needs to be extracted into a function to create a closure such that the 'this' references are maintained
      })
    );
  }
}

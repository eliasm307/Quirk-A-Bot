import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../declarations/types';
import AddLogEvent from '../log/AddLogEvent';
import DeleteLogEvent from '../log/DeleteLogEvent';
import {
  iAddLogEventProps, iChildLoggerCreatorProps, iDeleteLogEventProps, iTraitCollectionLogger,
  iTraitCollectionLogReporter
} from '../log/interfaces/log-interfaces';
import TraitCollecitonLogger from '../log/TraitCollectionLogger';
import { iBaseTrait, iBaseTraitData, iBaseTraitProps } from '../traits/interfaces/trait-interfaces';
import {
  iBaseTraitCollectionDataStorageProps, iBaseTraitDataStorage, iBaseTraitDataStorageProps,
  iTraitCollectionDataStorage
} from './interfaces/data-storage-interfaces';
import { createPath } from './utils/createPath';

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
	protected map: Map<N, T>;

	// ? is this required
	instanceCreator: (props: iBaseTraitProps<N, V, D>) => T;
	log: iTraitCollectionLogReporter;
	name: string;
	path: string;
	traitDataStorageInitialiser: <N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iBaseTraitDataStorage<N, V>;

	// ? is this required? if colleciton adds data to storage this means creating trait data and connecting data to trait instances would be done by 2 classes async, so it might be done in the wrong order. Opted to have these both on the trait side
	protected abstract afterAddInternal(name: N): void;
	protected abstract deleteTraitFromDataStorage(name: N): void;

	constructor({
		instanceCreator,
		traitDataStorageInitialiser,
		name,
		onAdd,
		onDelete,
		initialData,
		parentPath,
		logger,
	}: iBaseTraitCollectionDataStorageProps<N, V, D, T>) {
		// save local values
		this.afterAddCustom = onAdd;
		this.afterDeleteCustom = onDelete;
		this.name = name;
		this.instanceCreator = instanceCreator;
		this.traitDataStorageInitialiser = traitDataStorageInitialiser;

		// create path // ? should this be done by the concrete implementations?
		this.path = createPath(parentPath, name);

		// use logger if provided, otherwise create a local one
		this.logger = logger
			? logger({ sourceName: name })
			: new TraitCollecitonLogger({ sourceName: name, parentLogHandler: null });

		// expose logger reporter
    this.log = this.logger.reporter;
    
    const traitLoggerCreator = (props: iChildLoggerCreatorProps) => this.logger.createChildTraitLogger(props); // ? if the closure is in the class will that work?

		// add intial data, if any
		this.map = new Map<N, T>(
			initialData
				? initialData.map(({ name, value }) => [
						name,
						instanceCreator({
							name,
							value,
							traitDataStorageInitialiser,
							parentPath: this.path,
							logger: traitLoggerCreator,
						}),
				  ])
				: []
		);
	}

	get size(): number {
		return this.map.size;
	}

	delete(name: N): iTraitCollectionDataStorage<N, V, D, T> {
		if (!this.map.has(name)) {
			console.log(
				__filename,
				`Cannot delete property "${name}" from "${this.name}" trait collection as it doesnt exist in the collection`
			);
			return this; // return this instance for chaining
		}

		const oldValue = this.map.get(name)!.value;

		if (typeof oldValue !== 'undefined') {
			// ? do this as an abstract beforeDelete method, so specific classes can do what they want? Whats the difference?
			// do any cleanup on the trait before deleting
			const deatTraitWalking = this.map.get(name);
			if (deatTraitWalking) deatTraitWalking.cleanUp();

			// apply change locally
			this.map.delete(name);

			// apply change to data storage
			this.deleteTraitFromDataStorage(name);

			// log change
			this.logger.log(new DeleteLogEvent({ oldValue, property: name }));

			// do any custom after delete action
			if (this.afterDeleteCustom) this.afterDeleteCustom({ oldValue, property: name }); // ? is this required if logging is done here?
		} else {
			console.error(__filename, `old value was "${oldValue}" when deleting property "${name}"`);
		}

		return this; // return this instance for chaining
	}

	get(key: N): T | void {
		return this.map.get(key);
	}

	has(name: N): boolean {
		return this.map.has(name);
	}

	set(name: N, newValue: V): iTraitCollectionDataStorage<N, V, D, T> {
		// if trait already exists then just update it
		if (this.map.has(name)) {
			const trait = this.map.get(name);

			if (!trait) {
				console.error(__filename, `{this.#typeName} with name '${name}' is not defined but key exists`);
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

			// post add event
			this.afterAddInternal(name); // ? is this required

			if (this.afterAddCustom) this.afterAddCustom({ newValue, property: name }); // ? is this required
		}

		return this; // return this instance for chaining
	}

	toArray(): T[] {
		return Array.from(this.map.values());
	}

	toJson(): D[] {
		return this.toArray().map(e => e.toJson());
	}

	protected createTraitInstance(name: N, defaultValue: V) {
		// return existing instance or new instance
		return (
			this.map.get(name) ||
			this.instanceCreator({
				name,
				value: defaultValue,
				parentPath: this.path,
				traitDataStorageInitialiser: this.traitDataStorageInitialiser,
				logger: (props: iChildLoggerCreatorProps) => this.logger.createChildTraitLogger(props), // NOTE this needs to be extracted into a function to create a closure such that the 'this' references are maintained
			})
		);
	}
}

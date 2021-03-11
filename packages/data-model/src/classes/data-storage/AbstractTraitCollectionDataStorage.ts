import {
	iBaseTraitCollectionDataStorageProps,
	iBaseTraitDataStorage,
	iBaseTraitDataStorageProps,
	iTraitCollectionDataStorage,
} from '../../declarations/interfaces/data-storage-interfaces';
import {
	iAddLogEventProps,
	iDeleteLogEventProps,
	iTraitCollectionLogger,
	iTraitCollectionLogReporter,
} from '../../declarations/interfaces/log-interfaces';
import { iBaseTrait, iBaseTraitData, iBaseTraitProps } from '../../declarations/interfaces/trait-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../declarations/types';
import { createPath } from '../../utils/createPath';
import DeleteLogEvent from '../log/DeleteLogEvent';
import TraitCollecitonLogger from '../log/TraitCollectionLogger';

export default abstract class AbstractTraitCollectionDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> implements iTraitCollectionDataStorage<N, V, D, T> {
	protected afterDelete: (props: iDeleteLogEventProps<V>) => void;
	protected logger: iTraitCollectionLogger;
	protected map: Map<N, T>;
	protected onAdd: (props: iAddLogEventProps<V>) => void;

	instanceCreator: (props: iBaseTraitProps<N, V, D>) => T;
	log: iTraitCollectionLogReporter;
	name: string;
	path: string;
	traitDataStorageInitialiser: <N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iBaseTraitDataStorage<N, V>;

	// ? is this required? if colleciton adds data to storage this means creating trait data and connecting data to trait instances would be done by 2 classes async, so it might be done in the wrong order. Opted to have these both on the trait side
	protected abstract afterAdd(name: N): void;
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
		this.onAdd = onAdd;
		this.afterDelete = onDelete;
		this.name = name;
		this.instanceCreator = instanceCreator;
		this.traitDataStorageInitialiser = traitDataStorageInitialiser;

		// create path // ? should this be done by the concrete implementations?
		this.path = createPath(parentPath, name);

		// use logger if provided, otherwise create a new one
		this.logger = logger || new TraitCollecitonLogger({ sourceName: name, parentLogHandler: null });

		// expose logger reporter
		this.log = this.logger.reporter;

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
							logger: this.logger.createChildTraitLogger,
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
			this.afterDelete({ oldValue, property: name }); // ? is this required if logging is done here?
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
			this.onAdd({ newValue, property: name });

			// post add event
			this.afterAdd(name);
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
				logger: this.logger.createChildTraitLogger,
			})
		);
	}
}

import {
	iBaseTraitCollectionDataStorageProps,
	iBaseTraitDataStorageProps,
	iTraitCollectionDataStorage,
	iTraitDataStorage,
} from '../../../declarations/interfaces/data-storage-interfaces';
import {
	iAddLogEventProps,
	iDeleteLogEventProps,
	iLogEvent,
	iLogReport,
} from '../../../declarations/interfaces/log-interfaces';
import { iBaseTrait, iBaseTraitProps, iBaseTraitData } from '../../../declarations/interfaces/trait-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import AbstractTraitCollectionDataStorage from '../AbstractTraitCollectionDataStorage';

export default class InMemoryTraitCollectionDataStorage<
		N extends TraitNameUnionOrString,
		V extends TraitValueTypeUnion,
		D extends iBaseTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>
	extends AbstractTraitCollectionDataStorage<N, V, D, T>
	implements iTraitCollectionDataStorage<N, V, D, T> {
	protected onAdd: (props: iAddLogEventProps<V>) => void;
	protected onDelete: (props: iDeleteLogEventProps<V>) => void;
	protected map: Map<N, T>;

	// #logs: iLogCollection;
	#instanceCreator: (props: iBaseTraitProps<N, V, D>) => T;
	#traitDataStorageInitialiser: <N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iTraitDataStorage<N, V>;
	name: string;

	constructor(props: iBaseTraitCollectionDataStorageProps<N, V, D, T>) {
		super();
		const { instanceCreator, traitDataStorageInitialiser, name, onAdd, onDelete, initialData } = props;
		this.onAdd = onAdd;
		this.onDelete = onDelete;

		this.name = name;
		this.#instanceCreator = instanceCreator;
		this.#traitDataStorageInitialiser = traitDataStorageInitialiser;
		this.map = new Map<N, T>(
			initialData
				? initialData.map(({ name, value }) => [name, instanceCreator({ name, value, traitDataStorageInitialiser })])
				: []
		);
		// this.#logs = new LogCollection({ sourceName: name, sourceType: 'Trait Collection' });
	}
	toJson(): D[] {
		return this.toArray().map(e => e.toJson());
	}
	getLogReport(): iLogReport[] {
		throw new Error('Method not implemented.');
	}
	getLogEvents(): iLogEvent[] {
		throw new Error('Method not implemented.');
	}

	/**
	 * Update trait value if it exists, otherwise add a new one
	 * @param name name of trait to edit or create
	 * @param newValue value to assign
	 */
	set(name: N, newValue: V): iTraitCollectionDataStorage<N, V, D, T> {
		// if trait already exists then just update it
		if (this.map.has(name)) {
			const instance = this.map.get(name);

			if (!instance) {
				console.error(__filename, `{this.#typeName} with name '${name}' is not defined but key exists`);
				return this;
			}

			// apply change, the instance logs changes internally
			instance.value = newValue;
		} else {
			// add new trait instance
			this.map.set(
				name,
				this.#instanceCreator({
					name,
					value: newValue,
					traitDataStorageInitialiser: this.#traitDataStorageInitialiser,
				})
			);

			// log change
			this.onAdd({ newValue, property: name });
		}

		// call save function, not relevant for this class but can be used by classes extending this
		this.save();
		return this;
	}
	delete(name: N): iTraitCollectionDataStorage<N, V, D, T> {
		if (!this.map.has(name)) {
			console.warn(
				__filename,
				`Cannot delete property "${name}" from "${this.name}" trait collection as it doesnt exist in the collection`
			);
			return this;
		}

		const oldValue = this.map.get(name)!.value;

		if (typeof oldValue !== 'undefined') {
			// apply change
			this.map.delete(name);
			// log change
			this.onDelete({ oldValue, property: name });
		} else {
			console.error(__filename, `old value was "${oldValue}" when deleting property "${name}"`);
			return this;
		}

		// todo this should be done in trait collection data storage
		// autosave if save is available
		this.save();
		return this;
	}
	has(name: N): boolean {
		return this.map.has(name);
	}
	toArray(): T[] {
		return Array.from(this.map.values());
	}
	get size(): number {
		return this.map.size;
	}

	protected save(): boolean {
		return true;
	}
}

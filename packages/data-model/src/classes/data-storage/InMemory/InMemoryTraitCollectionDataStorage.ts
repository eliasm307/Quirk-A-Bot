import {
	iBaseTraitCollectionDataStorageProps,
	iBaseTraitDataStorageProps,
	iTraitCollectionDataStorage,
	iTraitDataStorage,
} from '../../../declarations/interfaces/data-storage-interfaces';
import { iLogCollection, iLogEvent, iLogReport } from '../../../declarations/interfaces/log-interfaces';
import {
	iBaseTrait,
	iBaseTraitProps,
	iGeneralTraitData,
	iTraitData,
} from '../../../declarations/interfaces/trait-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import AddLogEvent from '../../log/AddLogEvent';
import DeleteLogEvent from '../../log/DeleteLogEvent';
import LogCollection from '../../log/LogCollection';
import AbstractDataStorage from '../AbstractDataStorage';
import AbstractTraitCollectionDataStorage from '../AbstractTraitCollectionDataStorage';

export default class InMemoryTraitCollectionDataStorage<
		N extends TraitNameUnionOrString,
		V extends TraitValueTypeUnion,
		D extends iTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>
	extends AbstractTraitCollectionDataStorage<N, V, D, T>
	implements iTraitCollectionDataStorage<N, V, D, T> {
	protected map: Map<N, T>;

	#logs: iLogCollection;
	#instanceCreator: (props: iBaseTraitProps<N, V, D>) => T;
	#traitDataStorageInitialiser: (props: iBaseTraitDataStorageProps<N, V>) => iTraitDataStorage<N, V>;
	name: string;

	constructor(props: iBaseTraitCollectionDataStorageProps<N, V, D, T>, ...initialData: D[]) {
		super();
		const { instanceCreator, traitDataStorageInitialiser, name } = props;
		this.name = name;
		this.#instanceCreator = instanceCreator;
		this.#traitDataStorageInitialiser = traitDataStorageInitialiser;
		this.map = new Map<N, T>(
			initialData.map(({ name, value }) => [name, instanceCreator({ name, value, traitDataStorageInitialiser })])
		);
		this.#logs = new LogCollection({ sourceName: name, sourceType: 'Trait Collection' });
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
	set(name: N, newValue: V): void {
		// if trait already exists then just update it
		if (this.map.has(name)) {
			const instance = this.map.get(name);

			if (!instance)
				return console.error(__filename, `{this.#typeName} with name '${name}' is not defined but key exists`);

			const oldValue = instance.value;

			// apply change
			instance.value = newValue;

			// the instance logs changes internally
			// this.#logs.log(new UpdateLogEvent({ newValue, oldValue, property: name }));
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
			this.#logs.log(new AddLogEvent({ newValue, property: name }));
		}

		// todo this should be done in trait collection data storage
		// autosave if save available
		// if (this.saveAction) this.saveAction();
		this.save();
	}
	delete(name: N): void {
		const oldValue = this.map.get(name);
		const property = name;

		// apply change
		this.map.delete(name);

		// log change
		this.#logs.log(new DeleteLogEvent({ oldValue, property }));

		// todo this should be done in trait collection data storage
		// autosave if save is available
		// if (this.saveAction) this.saveAction();
		this.save();
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

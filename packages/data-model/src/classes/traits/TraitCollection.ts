import { iTraitCollectionDataStorage } from './../../declarations/interfaces/data-storage-interfaces';
import { TraitNameUnionOrString } from './../../declarations/types';
import {
	iBaseTrait,
	iBaseTraitProps,
	iTraitCollectionProps,
	iTraitData,
} from '../../declarations/interfaces/trait-interfaces';
import { TraitTypeNameUnion, TraitValueTypeUnion } from '../../declarations/types';
import LogCollection from '../log/LogCollection';
import DeleteLogEvent from '../log/DeleteLogEvent';
import AddLogEvent from '../log/AddLogEvent';
import { iLogCollection, iLogEvent, iLogReport } from '../../declarations/interfaces/log-interfaces';
import { iTraitCollection } from '../../declarations/interfaces/trait-collection-interfaces';
import { iBaseTraitDataStorageProps, iTraitDataStorage } from '../../declarations/interfaces/data-storage-interfaces';

export default class TraitCollection<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> implements iTraitCollection<N, V, D, T> {
	#instanceCreator: (props: iBaseTraitProps<N, V, D>) => T;
	#traitDataStorageInitialiser: (props: iBaseTraitDataStorageProps<N, V>) => iTraitDataStorage<N, V>;
	#dataStorage: iTraitCollectionDataStorage<N, V, D, T>;
	name: string;
	// #map: Map<N, T>;

	/** Collection of logs for trait collection, ie add and remove events only (update events are held in traits) */
	#logs: iLogCollection;
	#typeName: TraitTypeNameUnion | string = 'Trait';

	constructor({ instanceCreator, name, dataStorageFactory }: iTraitCollectionProps<N, V, D, T>, ...initialData: D[]) {
		this.name = name;
		this.#instanceCreator = instanceCreator;
		this.#traitDataStorageInitialiser = dataStorageFactory.newTraitDataStorageInitialiser(); // todo, reuse this function instead of making a new one each time

		this.#dataStorage = dataStorageFactory.newTraitCollectionDataStorage({
			instanceCreator,
			name,
			traitDataStorageInitialiser: this.#traitDataStorageInitialiser,
			initialData,
		});

		// todo this should be moved to trait collection data storage
		/*
		this.#map = new Map<N, T>(
			initialData.map(({ name, value }) => [
				name,
				instanceCreator({
					name,
					value,
					traitDataStorageInitialiser: this.#traitDataStorageInitialiser,
				}),
			])
		);
		*/

		this.#logs = new LogCollection({ sourceName: name, sourceType: 'Trait Collection' });
	}
	toArray(): T[] {
		return this.#dataStorage.toArray();
	}
	getLogEvents(): iLogEvent[] {
		//todo memoise
		// combine logs from reports and and sort oldest to newest
		return this.getLogReport()
			.reduce((events, report) => [...events, ...report.logEvents], [] as iLogEvent[])
			.sort((a, b) => Number(a.timeStamp - b.timeStamp));
	}
	getLogReport(): iLogReport[] {
		return [this.#logs.getReport(), ...this.toArray().map(e => e.getLogReport())];
	}
	toJson(): D[] {
		return this.toArray().map(e => e.toJson());
	}
	get size(): number {
		return this.#dataStorage.size;
	}

	get(name: N): T | void {
		return this.#dataStorage.get(name);
	}
	delete(name: N): void {
		const oldValue = this.#dataStorage.get(name);
		const property = name;

		// apply change
		this.#dataStorage.delete(name);

		// log change
		this.#logs.log(new DeleteLogEvent({ oldValue, property }));

		// todo this should be done in trait collection data storage
		// autosave if save is available
		// if (this.saveAction) this.saveAction();
	}
	has(name: N): boolean {
		return this.#dataStorage.has(name);
	}

	/**
	 * Update trait value if it exists, otherwise add a new one
	 * @param name name of trait to edit or create
	 * @param newValue value to assign
	 */
	set( name: N, newValue: V ): void {
		// todo this should have logging for modification or creation
		this.#dataStorage.set(name, newValue);
		// if trait already exists then just update it
		/*
		if (this.#map.has(name)) {
			const instance = this.#map.get(name);

			if (!instance)
				return console.error(__filename, `${this.#typeName} with name '${name}' is not defined but key exists`);

			const oldValue = instance.value;

			// apply change
			instance.value = newValue;

			// the instance logs changes internally
			// this.#logs.log(new UpdateLogEvent({ newValue, oldValue, property: name }));
		} else {
			// add new trait instance
			this.#map.set(
				name,
				this.#instanceCreator({
					name,
					value: newValue,
					traitDataStorageInitialiser: this.#traitDataStorageInitialiser,
				})
			);

			// log change
			this.#logs.log(new AddLogEvent({ newValue, property: name }));
		}*/

		// todo this should be done in trait collection data storage
		// autosave if save available
		// if (this.saveAction) this.saveAction();
	}
}

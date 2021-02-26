import { iBaseTrait, iTraitCollectionArguments } from '../../declarations/interfaces/trait-interfaces';
import { TraitName, TraitMap, TraitValue, TraitType, TraitData } from '../../declarations/types';
import { 
	iTraitData,
	iTraitCollection,
} from '../../declarations/interfaces/trait-interfaces';
import LogCollection from '../log/LogCollection';
import DeleteLogEvent from '../log/DeleteLogEvent';
import UpdateLogEvent from '../log/UpdateLogEvent';
import AddLogEvent from '../log/AddLogEvent';
import { iLogger, iLogEvent } from '../../declarations/interfaces/log-interfaces';

export default class TraitCollection<T extends iBaseTrait> implements iTraitCollection<T>, iLogger {
	#instanceCreator: (name: TraitName<T>, value: TraitValue<T>) => T;
	private saveAction?: () => boolean;
	#map: TraitMap<T>;
	#logs = new LogCollection<TraitValue<T>>();

	#typeName: TraitType | string = 'Trait';
	constructor({ instanceCreator, saveAction }: iTraitCollectionArguments<T>, ...initialData: TraitData<T>[]) {
		this.saveAction = saveAction;
		this.#instanceCreator = instanceCreator;
		this.#map = new Map<TraitName<T>, T>(
			initialData.map(e => [e.name as TraitName<T>, instanceCreator(e.name as TraitName<T>, e.value as TraitValue<T>)])
		);
	}
	getLogData(): iLogEvent[] {
		const collectionLogs: iLogEvent[] = this.#logs.toJson();
		const itemLogs: iLogEvent[] = Array.from(this.#map.values()).reduce(
			(acc: iLogEvent[], e) => [...acc, ...e.getLogData()],
			[]
		);
		//todo memoise the above

		// console.warn('getLogData()', { collectionLogs, itemLogs });

		// combine logs and sort oldest to newest
		return [...collectionLogs, ...itemLogs].sort((a, b) => Number(a.time.getTime() - b.time.getTime()));
	}
	toJson(): TraitData<T>[] {
		return Array.from(this.#map.values()).map(e => e.toJson() as TraitData<T>);
	}
	get size(): number {
		return this.#map.size;
	}

	get(name: TraitName<T>): T | void {
		return this.#map.get(name);
	}
	delete(name: TraitName<T>): void {
		const oldValue = this.#map.get(name);
		const property = name;

		// todo add error handling

		// apply change
		this.#map.delete(name);

		// log change
		this.#logs.log(new DeleteLogEvent({ oldValue, property }));

		// autosave if save is available
		if (this.saveAction) this.saveAction();
	}
	has(name: TraitName<T>): boolean {
		return this.#map.has(name);
	}

	/**
	 * Update trait value if it exists, otherwise add a new one
	 * @param name name of trait to edit or create
	 * @param newValue value to assign
	 */
	set(name: TraitName<T>, newValue: TraitValue<T>): void {
		// if trait already exists then just update it
		if (this.#map.has(name)) {
			const instance = this.#map.get(name);

			if (!instance)
				return console.error(__filename, `${this.#typeName} with name '${name}' is not defined but key exists`);

			const oldValue = instance.value;

			// apply change
			instance.value = newValue;

			// log change // NOTE the instances also log changes?
			this.#logs.log(new UpdateLogEvent({ newValue, oldValue, property: name }));
		} else {
			// add new trait instance
			this.#map.set(name, this.#instanceCreator(name, newValue));

			// log change
			this.#logs.log(new AddLogEvent({ newValue, property: name }));
		}

		// autosave if save available
		if (this.saveAction) this.saveAction();
	}
}

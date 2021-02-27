import { TraitNameUnionOrString } from './../../declarations/types';
import { iBaseTrait, iTraitCollectionProps, iTraitData } from '../../declarations/interfaces/trait-interfaces';
import {
	TraitNameDynamic,
	TraitMap,
	TraitValueDynamic,
	TraitTypeNameUnion,
	TraitDataDynamic,
	TraitNameUnion,
	TraitValueTypeUnion,
} from '../../declarations/types';
import { iTraitCollection } from '../../declarations/interfaces/trait-interfaces';
import LogCollection from '../log/LogCollection';
import DeleteLogEvent from '../log/DeleteLogEvent';
import UpdateLogEvent from '../log/UpdateLogEvent';
import AddLogEvent from '../log/AddLogEvent';
import { iLogger, iLogEvent } from '../../declarations/interfaces/log-interfaces';

interface iInstanceCreatorProps<T extends iTraitData<TraitNameDynamic<T>, TraitValueDynamic<T>>> {
	name: TraitNameDynamic<T>;
	value: TraitValueDynamic<T>;
}

export default class TraitCollection<T extends iBaseTrait<TraitNameDynamic<T>, TraitValueDynamic<T>>>
	implements iTraitCollection<T>, iLogger {
	#instanceCreator: (props: iInstanceCreatorProps<T>) => T;
	private saveAction?: () => boolean;
	#map: TraitMap<T>;
	#logs = new LogCollection<TraitValueDynamic<T>>();
	#typeName: TraitTypeNameUnion | string = 'Trait';
	constructor({ instanceCreator, saveAction }: iTraitCollectionProps<T>, ...initialData: TraitDataDynamic<T>[]) {
		this.saveAction = saveAction;
		this.#instanceCreator = instanceCreator;
		this.#map = new Map<TraitNameDynamic<T>, T>(
			initialData.map(e => [
				e.name as TraitNameDynamic<T>,
				instanceCreator({ name: e.name as TraitNameDynamic<T>, value: e.value as TraitValueDynamic<T> }),
			])
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
	toJson(): TraitDataDynamic<T>[] {
		return Array.from(this.#map.values()).map(e => e.toJson() as TraitDataDynamic<T>);
	}
	get size(): number {
		return this.#map.size;
	}

	get(name: TraitNameDynamic<T>): T | void {
		return this.#map.get(name);
	}
	delete(name: TraitNameDynamic<T>): void {
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
	has(name: TraitNameDynamic<T>): boolean {
		return this.#map.has(name);
	}

	/**
	 * Update trait value if it exists, otherwise add a new one
	 * @param name name of trait to edit or create
	 * @param newValue value to assign
	 */
	set(name: TraitNameDynamic<T>, newValue: TraitValueDynamic<T>): void {
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
			this.#map.set( name, this.#instanceCreator( { name, value: newValue }));

			// log change
			this.#logs.log(new AddLogEvent({ newValue, property: name }));
		}

		// autosave if save available
		if (this.saveAction) this.saveAction();
	}
}

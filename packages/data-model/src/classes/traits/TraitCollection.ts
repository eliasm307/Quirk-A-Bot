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
import UpdateLogEvent from '../log/UpdateLogEvent';
import AddLogEvent from '../log/AddLogEvent';
import { iLogCollection, iLogEvent, iLogReport } from '../../declarations/interfaces/log-interfaces';
import { iTraitCollection } from '../../declarations/interfaces/trait-collection-interfaces';
import { threadId } from 'node:worker_threads';

// todo delete
/*
interface iInstanceCreatorProps<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion> {
	name: N;
	value: V;
}*/

export default class TraitCollection<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> implements iTraitCollection<N, V, D, T> {
	#instanceCreator: (props: iBaseTraitProps<N, V, D>) => T;
	private saveAction?: () => boolean;
	name: string;
	#map: Map<N, T>;
	#logs: iLogCollection;
	#typeName: TraitTypeNameUnion | string = 'Trait';
	constructor(
		{ instanceCreator, saveAction, name }: iTraitCollectionProps<N, V, D, T>,
		...initialData: iTraitData<N, V>[]
	) {
		this.name = name;
		this.saveAction = saveAction;
		this.#instanceCreator = instanceCreator;
		this.#map = new Map<N, T>(initialData.map(({ name, value }) => [name, instanceCreator({ name, value })]));
		this.#logs = new LogCollection({ sourceName: name, sourceType: 'Trait Collection' });
	}
	getLogEvents(): iLogEvent[] {
		//todo memoise
		// combine logs from reports and and sort oldest to newest
		return this.getLogReport()
			.reduce((events, report) => [...events, ...report.logEvents], [] as iLogEvent[])
			.sort((a, b) => Number(a.time.getTime() - b.time.getTime()));
	}
	getLogReport(): iLogReport[] {
		return Array.from(this.#map.values()).map(e => e.getLogReport());
	}
	toJson(): D[] {
		return Array.from(this.#map.values()).map(e => e.toJson());
	}
	get size(): number {
		return this.#map.size;
	}

	get(name: N): T | void {
		return this.#map.get(name);
	}
	delete(name: N): void {
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
	has(name: N): boolean {
		return this.#map.has(name);
	}

	/**
	 * Update trait value if it exists, otherwise add a new one
	 * @param name name of trait to edit or create
	 * @param newValue value to assign
	 */
	set(name: N, newValue: V): void {
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
			this.#map.set(name, this.#instanceCreator({ name, value: newValue }));

			// log change
			this.#logs.log(new AddLogEvent({ newValue, property: name }));
		}

		// autosave if save available
		if (this.saveAction) this.saveAction();
	}
}

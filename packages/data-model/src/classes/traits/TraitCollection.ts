import { iAddLogEventProps, iDeleteLogEventProps } from './../../declarations/interfaces/log-interfaces';
import { iTraitCollectionDataStorage } from './../../declarations/interfaces/data-storage-interfaces';
import { TraitNameUnionOrString } from './../../declarations/types';
import { iBaseTrait, iTraitCollectionProps, iBaseTraitData } from '../../declarations/interfaces/trait-interfaces';
import { TraitTypeNameUnion, TraitValueTypeUnion } from '../../declarations/types';
import LogCollection from '../log/AbstractLogger';
import DeleteLogEvent from '../log/DeleteLogEvent';
import AddLogEvent from '../log/AddLogEvent';
import { iBaseLogger, iLogEvent, iBaseLogReport } from '../../declarations/interfaces/log-interfaces';
import { iTraitCollection } from '../../declarations/interfaces/trait-collection-interfaces';
import {
	iBaseTraitDataStorageProps,
	iBaseTraitDataStorage,
} from '../../declarations/interfaces/data-storage-interfaces';
import { createPath } from '../../utils/createPath';
import { hasCleanUp } from '../../utils/typePredicates';

export default class TraitCollection<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> implements iTraitCollection<N, V, D, T> {
	#traitDataStorageInitialiser: <N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iBaseTraitDataStorage<N, V>;

	// ? should this be # or protected?
	#dataStorage: iTraitCollectionDataStorage<N, V, D, T>;
	name: string;
	path: string;

	/** Collection of logs for trait collection, ie add and remove events only (update events are held in traits) */
	protected log: iBaseLogger;
	#typeName: TraitTypeNameUnion | string = 'Trait Collection';

	constructor(
		{
			instanceCreator,
			name,
			traitDataStorageInitialiser,
			traitCollectionDataStorageInitialiser,
			parentPath,
		}: iTraitCollectionProps<N, V, D, T>,
		...initialData: D[]
	) {
		this.name = name;
		this.path = createPath(parentPath, name); // ? should data storage be responsible for assigning path? maybe rename this to "dataStorageId"
		this.#traitDataStorageInitialiser = traitDataStorageInitialiser; // todo, reuse this function instead of making a new one each time
		this.log = new LogCollection({ sourceName: name, sourceType: 'Trait Collection' });

		this.#dataStorage = traitCollectionDataStorageInitialiser({
			instanceCreator,
			name,
			parentPath,
			traitDataStorageInitialiser: this.#traitDataStorageInitialiser,
			initialData,
			onAdd: (props: iAddLogEventProps<V>) => this.log.log(new AddLogEvent(props)),
			onDelete: (props: iDeleteLogEventProps<V>) => this.log.log(new DeleteLogEvent(props)),
		});
	}
	cleanUp(): boolean {
		// if the data storage has a cleanup function then call it and return the result,
		// otherwise return true if no cleanup required
		return hasCleanUp(this.#dataStorage) ? this.#dataStorage.cleanUp() : true;
	}

	toArray(): T[] {
		return this.#dataStorage.toArray();
	}
	getLogEvents(): iLogEvent[] {
		//todo memoise
		// combine logs from reports and and sort oldest to newest
		return this.getLogReports()
			.reduce((events, report) => [...events, ...report.events], [] as iLogEvent[])
			.sort((a, b) => Number(a.timeStamp - b.timeStamp));
	}
	getLogReports(): iBaseLogReport[] {
		return [this.log.getReport(), ...this.toArray().map(e => e.getLogReport())];
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
	delete(name: N): iTraitCollection<N, V, D, T> {
		this.#dataStorage.delete(name);
		return this;
	}
	has(name: N): boolean {
		return this.#dataStorage.has(name);
	}

	/**
	 * Update trait value if it exists, otherwise add a new one
	 * @param name name of trait to edit or create
	 * @param newValue value to assign
	 */
	set(name: N, newValue: V): iTraitCollection<N, V, D, T> {
		this.#dataStorage.set(name, newValue);
		return this;
	}
}

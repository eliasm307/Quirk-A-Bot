import {
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
import { iTraitCollection } from '../../declarations/interfaces/trait-collection-interfaces';
import { iBaseTrait, iBaseTraitData, iTraitCollectionProps } from '../../declarations/interfaces/trait-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../declarations/types';
import { hasCleanUp } from '../../utils/typePredicates';
import AddLogEvent from '../log/AddLogEvent';
import DeleteLogEvent from '../log/DeleteLogEvent';
import TraitCollectionLogger from '../log/TraitCollectionLogger';

export default class TraitCollection<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> implements iTraitCollection<N, V, D, T> {
	// ? should this be # or protected?
	#dataStorage: iTraitCollectionDataStorage<N, V, D, T>;
	/*
	#traitDataStorageInitialiser: <N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iBaseTraitDataStorage<N, V>;*/
	// #typeName: TraitTypeNameUnion | string = 'Trait Collection';// ? is this required
	/** Read only log reporter */
	log: iTraitCollectionLogReporter;
	name: string;
	path: string;

	constructor(
		{
			instanceCreator,
			name,
			traitDataStorageInitialiser,
			traitCollectionDataStorageInitialiser,
			parentPath,
			logger,
		}: iTraitCollectionProps<N, V, D, T>,
		...initialData: D[]
	) {
		this.name = name;

		// this.#traitDataStorageInitialiser = traitDataStorageInitialiser;

		// use provided logger creator otherwise create new local logger
		/*this.logger = logger
			? logger({ sourceName: name })
			: new TraitCollectionLogger({ sourceName: name, parentLogHandler: null });*/

		this.#dataStorage = traitCollectionDataStorageInitialiser({
			instanceCreator,
			name,
			parentPath,
			traitDataStorageInitialiser,
			initialData,
			// onAdd: (props: iAddLogEventProps<V>) => this.logger.log(new AddLogEvent(props)),
			// onDelete: (props: iDeleteLogEventProps<V>) => this.logger.log(new DeleteLogEvent(props)),
			logger,
		});
		// expose logger reporter
		this.log = this.#dataStorage.log;

		this.path = this.#dataStorage.path; // data storage defines path to use
	}

	get size(): number {
		return this.#dataStorage.size;
	}

	cleanUp(): boolean {
		// if the data storage has a cleanup function then call it and return the result,
		// otherwise return true if no cleanup required
		return hasCleanUp(this.#dataStorage) ? this.#dataStorage.cleanUp() : true;
	}

	delete(name: N): iTraitCollection<N, V, D, T> {
		this.#dataStorage.delete(name);
		return this;
	}

	get(name: N): T | void {
		return this.#dataStorage.get(name);
	}

	has(name: N): boolean {
		return this.#dataStorage.has(name);
	}

	// todo delete
	/*
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

*/

	/**
	 * Update trait value if it exists, otherwise add a new one
	 * @param name name of trait to edit or create
	 * @param newValue value to assign
	 */
	set(name: N, newValue: V): iTraitCollection<N, V, D, T> {
		this.#dataStorage.set(name, newValue);
		return this;
	}

	toArray(): T[] {
		return this.#dataStorage.toArray();
	}

	toJson(): D[] {
		return this.toArray().map(e => e.toJson());
	}
}

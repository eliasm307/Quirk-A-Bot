import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../declarations/types';
import { iTraitCollectionDataStorage } from '../data-storage/interfaces/data-storage-interfaces';
import { iTraitCollectionLogReporter } from '../log/interfaces/log-interfaces';
import { iTraitCollection } from './interfaces/trait-collection-interfaces';
import { iBaseTrait, iBaseTraitData, iTraitCollectionProps } from './interfaces/trait-interfaces';

export default class TraitCollection<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> implements iTraitCollection<N, V, D, T> {
	#dataStorage: iTraitCollectionDataStorage<N, V, D, T>;
	// #typeName: TraitTypeNameUnion | string = 'Trait Collection'; // ? is this required
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
			loggerCreator: logger,
		}: iTraitCollectionProps<N, V, D, T>,
		...initialData: D[]
	) {
		this.name = name;

		this.#dataStorage = traitCollectionDataStorageInitialiser({
			instanceCreator,
			name,
			parentPath,
			traitDataStorageInitialiser,
			initialData,
			// onAdd: (props: iAddLogEventProps<V>) => this.logger.log(new AddLogEvent(props)), // todo delete?
			// onDelete: (props: iDeleteLogEventProps<V>) => this.logger.log(new DeleteLogEvent(props)),
			loggerCreator: logger,
		});
		// expose logger reporter
		this.log = this.#dataStorage.log;

		this.path = this.#dataStorage.path; // data storage defines path to use
	}

	get size(): number {
		return this.#dataStorage.size;
	}

	cleanUp(): boolean {
		return this.#dataStorage.cleanUp();
	}

	data(): D[] {
		return this.toArray().map(e => e.data());
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
}

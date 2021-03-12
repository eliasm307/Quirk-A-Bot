import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../declarations/types';
import { hasCleanUp } from '../../utils/typePredicates';
import { iBaseTraitDataStorage } from '../data-storage/interfaces/data-storage-interfaces';
import { iTraitLogReporter } from '../log/interfaces/log-interfaces';
import { iBaseTrait, iBaseTraitData, iBaseTraitProps } from './interfaces/trait-interfaces';

export default abstract class AbstractBaseTrait<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>
> implements iBaseTrait<N, V, D> {
	protected dataStorage: iBaseTraitDataStorage<N, V>;

	readonly log: iTraitLogReporter;
	readonly name: N;
	readonly path: string;
	readonly data: () => D;

	protected abstract newValueIsValid(newVal: V): boolean;
	protected abstract preProcessValue(newValueRaw: V): V;

	constructor({ name, value, data: toJson, traitDataStorageInitialiser, parentPath, loggerCreator: logger }: iBaseTraitProps<N, V, D>) {
		this.name = name;

		// initialise data store
		this.dataStorage = traitDataStorageInitialiser({
			name,
			defaultValueIfNotDefined: this.preProcessValue(value),
			parentPath,
			loggerCreator: logger,
		});

		this.log = this.dataStorage.log;

		// the data storage is responsible for providing a suitable path
		this.path = this.dataStorage.path;

		// make sure toJson is provided
		if (!toJson) throw Error(`${__filename} toJson function not defined`);
		this.data = toJson;
	}

	public get value() {
		return this.dataStorage.value;
	}

	public set value(newValRaw: V) {
		// todo delete? data storage should handle actually changing the value
		/*

		// justification should be done in newValueIsValid function
		if (!this.newValueIsValid(newValue)) return;

		// get current value as old value
		const oldValue: V = this.dataStorage.value;

		// if old value is the same as new value do nothing
		if (oldValue === newValue) {
			// console.log(__filename, `Trait value was changed to the same value, nothing was done.`);
			return;
    }
    */

		const newValueProcessed = this.preProcessValue(newValRaw);
		if (!this.newValueIsValid(newValueProcessed)) return;

		// implement property change on data storage
		this.dataStorage.value = newValueProcessed;
	}

	cleanUp(): boolean {
		// if the data storage has a cleanup function then call it and return the result,
		// otherwise return true if no cleanup required
		return hasCleanUp(this.dataStorage) ? this.dataStorage.cleanUp() : true;
	}
}

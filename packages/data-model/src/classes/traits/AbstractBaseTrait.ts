import { iLogCollection, iLogReport } from './../../declarations/interfaces/log-interfaces';
import { iLogEvent } from '../../declarations/interfaces/log-interfaces';
import { iBaseTrait } from '../../declarations/interfaces/trait-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../declarations/types';
import { iBaseTraitProps, iBaseTraitData } from '../../declarations/interfaces/trait-interfaces';
import LogCollection from '../log/LogCollection';
import UpdateLogEvent from '../log/UpdateLogEvent';
import { iBaseTraitDataStorage } from '../../declarations/interfaces/data-storage-interfaces';
import { createPath } from '../../utils/createPath';
import { hasCleanUp } from '../../utils/typePredicates';

export default abstract class AbstractBaseTrait<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>
> implements iBaseTrait<N, V, D> {
	protected dataStorage: iBaseTraitDataStorage<N, V>;
	protected logs: iLogCollection;
	toJson: () => D;
	readonly path: string;
	readonly name: N;

	protected abstract newValueIsValid(newVal: V): boolean;
	protected abstract preProcessValue(newValueRaw: V): V;

	constructor({ name, value, toJson, traitDataStorageInitialiser, parentPath }: iBaseTraitProps<N, V, D>) {
		this.name = name;
		this.path = createPath(parentPath, name);

		// initialise data store
		this.dataStorage = traitDataStorageInitialiser({
			name,
			defaultValueIfNotDefined: this.preProcessValue(value),
			path: this.path,
		});

		// make sure toJson is provided
		if (!toJson) throw Error(`${__filename} toJson function not defined`);
		this.toJson = toJson;

		// initialise log collection
		this.logs = new LogCollection({ sourceType: 'Trait', sourceName: this.name });
	}
	cleanUp(): boolean {
		// if the data storage has a cleanup function then call it and return the result,
		// otherwise return true if no cleanup required
		return hasCleanUp(this.dataStorage) ? this.dataStorage.cleanUp() : true;
	}

	public set value(newValRaw: V) {
		const newValue = this.preProcessValue(newValRaw);

		// justification should be done in newValueIsValid function
		if (!this.newValueIsValid(newValue)) return;

		// get current value as old value
		const oldValue: V = this.dataStorage.value;

		// if old value is the same as new value do nothing
		if (oldValue === newValue) {
			// console.log(__filename, `Trait value was changed to the same value, nothing was done.`);
			return;
		}

		// implement property change on data storage
		this.dataStorage.value = newValue;

		// log change
		this.logs.log(new UpdateLogEvent({ newValue, oldValue, property: this.name }));
	}
	public get value() {
		return this.dataStorage.value;
	}

	getLogEvents(): iLogEvent[] {
		return this.getLogReport().logEvents;
	}

	getLogReport(): iLogReport {
		return this.logs.getReport();
	}
}

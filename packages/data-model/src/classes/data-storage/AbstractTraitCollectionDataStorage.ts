import { iAddLogEventProps, iDeleteLogEventProps } from './../../declarations/interfaces/log-interfaces';
import { iBaseTrait, iBaseTraitData, iBaseTraitProps } from './../../declarations/interfaces/trait-interfaces';
import {
	iBaseTraitCollectionDataStorageProps,
	iBaseTraitDataStorageProps,
	iTraitCollectionDataStorage,
	iTraitDataStorage,
} from './../../declarations/interfaces/data-storage-interfaces';
import { TraitNameUnionOrString } from './../../declarations/types';
import { TraitValueTypeUnion } from '../../declarations/types';
import { iLogReport, iLogEvent } from '../../declarations/interfaces/log-interfaces';
import path from 'path';

export default abstract class AbstractTraitCollectionDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> implements iTraitCollectionDataStorage<N, V, D, T> {
	path: string;
	name: string;
	protected onAdd: (props: iAddLogEventProps<V>) => void;
	protected onDelete: (props: iDeleteLogEventProps<V>) => void;
	protected map: Map<N, T>;

	// #logs: iLogCollection;
	instanceCreator: (props: iBaseTraitProps<N, V, D>) => T;
	traitDataStorageInitialiser: <N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iTraitDataStorage<N, V>;

	constructor({
		instanceCreator,
		traitDataStorageInitialiser,
		name,
		onAdd,
		onDelete,
		initialData,
		parentPath,
	}: iBaseTraitCollectionDataStorageProps<N, V, D, T>) {
		this.onAdd = onAdd;
		this.onDelete = onDelete;
		this.path = path.resolve(parentPath, name);
		this.name = name;
		this.instanceCreator = instanceCreator;
		this.traitDataStorageInitialiser = traitDataStorageInitialiser;
		this.map = new Map<N, T>(
			initialData
				? initialData.map(({ name, value }) => [
						name,
						instanceCreator({ name, value, traitDataStorageInitialiser, parentPath: this.path }),
				  ])
				: []
		);
	}

	protected abstract afterAdd(name: N): void;

	protected abstract afterDelete(name: N): void;

	toJson(): D[] {
		return this.toArray().map(e => e.toJson());
	}
	getLogReport(): iLogReport[] {
		throw new Error('Method not implemented.');
	}
	getLogEvents(): iLogEvent[] {
		throw new Error('Method not implemented.');
	}

	get(key: N): T | void {
		return this.map.get(key);
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

	set(name: N, newValue: V): iTraitCollectionDataStorage<N, V, D, T> {
		// if trait already exists then just update it
		if (this.map.has(name)) {
			const trait = this.map.get(name);

			if (!trait) {
				console.error(__filename, `{this.#typeName} with name '${name}' is not defined but key exists`);
				return this; // return this instance for chaining
			}

			// apply change
			// NOTE traits will handle changes internally, no need to do anything here
			trait.value = newValue;
		} else {
			// add new trait instance
			this.map.set(
				name,
				this.instanceCreator({
					name,
					value: newValue,
					parentPath: this.path,
					traitDataStorageInitialiser: this.traitDataStorageInitialiser,
				})
			);

			// log change
			this.onAdd({ newValue, property: name });
			this.afterAdd(name);
		}

		return this; // return this instance for chaining
	}

	delete(name: N): iTraitCollectionDataStorage<N, V, D, T> {
		if (!this.map.has(name)) {
			console.warn(
				__filename,
				`Cannot delete property "${name}" from "${this.name}" trait collection as it doesnt exist in the collection`
			);
			return this; // return this instance for chaining
		}

		const oldValue = this.map.get(name)!.value;

		if (typeof oldValue !== 'undefined') {
			// apply change
			this.map.delete(name);
			this.afterDelete(name); // ? rename to 'deleteFromDataStorage, this should be called only, the data storage should be responsible for actually deleting the item from the map? this might end up being done twice otherwise, just do a check on data store method before delete, this will be repeated for all so do it here once
			// log change
			this.onDelete({ oldValue, property: name });
		} else {
			console.error(__filename, `old value was "${oldValue}" when deleting property "${name}"`);
		}

		return this; // return this instance for chaining
	}
}

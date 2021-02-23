import { TraitName, TraitMap, TraitValue, TraitType } from './../declarations/types';
import {
	iCharacterSheet,
	iLogEvent,
	iLogger,
	iSaveAction,
	iTrait,
	iTraitCollection,
} from './../declarations/interfaces';
import LogCollection from './log/LogCollection';

export interface iTraitCollectionArguments<T extends iTrait> extends iSaveAction {
	instanceCreator: (name: TraitName<T>, value: TraitValue<T>) => T;
}

export default class TraitCollection<T extends iTrait> implements iTraitCollection<T>, iLogger  {
	#saveAction: () => boolean;
	#instanceCreator: (name: TraitName<T>, value: TraitValue<T>) => T;
	#map: TraitMap<T>;
	#logs = new LogCollection<TraitValue<T>>();

	// todo add trait typename util which gets an appropriate name based on the type of TraitName, do as conditional type
	#typeName: TraitType | string = 'Trait';
	constructor({ instanceCreator, saveAction }: iTraitCollectionArguments<T>, ...initialData: T[]) {
		this.#saveAction = saveAction;
		this.#instanceCreator = instanceCreator;
		this.#map = new Map<TraitName<T>, T>(initialData.map(e => [e.name as TraitName<T>, e]));
	}
	getLogData(): iLogEvent  [] {

		const collectionLogs = this.#logs.toJson();
		const itemLogs = Array.from(this.#map.values()).map(e => e.);


		return [...this.#logs.toJson(), ...this.#map.entries()];
	}
	toJson(): T[] {
		return Array.from(this.#map.values());
	}
	get size(): number {
		return this.#map.size;
	}

	get(name: TraitName<T>): T | void {
		return this.#map.get(name);
	}
	delete(name: TraitName<T>): void {
		// todo log change
		// todo add autosave
		this.#map.delete(name);
	}
	has(name: TraitName<T>): boolean {
		return this.#map.has(name);
	}

	/**
	 * Update trait value if it exists, otherwise add a new one
	 * @param name name of trait to edit or create
	 * @param value value to assign
	 */
	set(name: TraitName<T>, value: TraitValue<T>): void {
		// if trait already exists then just update it
		if (this.#map.has(name)) {
			const instance = this.#map.get(name);

			if (!instance)
				return console.error(__filename, `${this.#typeName} with name '${name}' is not defined but key exists`);

			// todo log change
			// todo add autosave
			instance.value = value;
		} else {
			// todo log change
			// todo add autosave
			// else add new trait instance
			this.#map.set(name, this.#instanceCreator(name, value));
		}
	}
}

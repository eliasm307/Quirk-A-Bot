import { TraitName, TraitMap, TraitValue } from './../declarations/types';
import { iCharacterSheet, iTrait, iTraitCollection } from './../declarations/interfaces';

export interface iTraitCollectionArguments<T extends iTrait> {
	characterSheet: iCharacterSheet;
	instanceCreator: (name: TraitName<T>, value: TraitValue<T>) => T;
}

export default class TraitCollection<T extends iTrait> implements iTraitCollection<T> {
	#characterSheet: iCharacterSheet;
	#instanceCreator: (name: TraitName<T>, value: TraitValue<T>) => T;
	#map: TraitMap<T>;

	// todo add trait typename util which gets an appropriate name based on the type of TraitName
	#typeName: string = 'Trait';
	constructor({ characterSheet, instanceCreator }: iTraitCollectionArguments<T>, ...initialData: T[]) {
		this.#characterSheet = characterSheet;
		this.#instanceCreator = instanceCreator;
		this.#map = new Map<TraitName<T>, T>(initialData.map(e => [e.name as TraitName<T>, e]));
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
			instance.value = value;
		} else {
			// todo log change
			// else add new trait instance
			this.#map.set(name, this.#instanceCreator(name, value));
		}
	}
}

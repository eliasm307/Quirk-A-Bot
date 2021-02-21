import { TraitName, TraitMap } from './../declarations/types';
import { iCharacterSheet, iTrait, iTraitCollection } from './../declarations/interfaces';

export default class TraitCollection<T extends iTrait> implements iTraitCollection<T> {
	#characterSheet: iCharacterSheet;
	#instanceCreator: (name: TraitName<T>, value: number) => T;
	#map: TraitMap<T> = new Map<TraitName<T>, T>();

	// todo add trait typename util which gets an appropriate name based on the type of TraitName
	#typeName: string = 'Trait';
	constructor(characterSheet: iCharacterSheet, instanceCreator: (name: TraitName<T>, value: number) => T) {
		this.#characterSheet = characterSheet;
		this.#instanceCreator = instanceCreator;
	}
	toJson(): iTrait[] {
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

	set(name: TraitName<T>, value: number = 0): void {
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

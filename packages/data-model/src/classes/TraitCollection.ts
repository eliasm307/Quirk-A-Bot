import { TraitName, TraitMap } from './../declarations/types';
import { iCharacterSheet, iTrait, iTraitCollection } from './../declarations/interfaces';

export default class TraitCollection<T extends iTrait> implements iTraitCollection<T>{
	#characterSheet: iCharacterSheet;
	#instanceCreator: (name: TraitName<T>, value: number) => T;
	#map: TraitMap<T> = new Map<TraitName<T>, T>();
	#typeName: string = '';
	constructor(characterSheet: iCharacterSheet, instanceCreator: (name: TraitName<T>, value: number) => T) {
		this.#characterSheet = characterSheet;
		this.#instanceCreator = instanceCreator;
	}
  size: number = 0;
  get( name: TraitName<T> ): T {
    throw new Error( 'Method not implemented.' );
  }
  delete( name: TraitName<T> ): T {
    throw new Error( 'Method not implemented.' );
  }
  has( name: TraitName<T> ): boolean {
    throw new Error( 'Method not implemented.' );
  }

	set(name: TraitName<T>, value: number = 0): void {
		if (name && value) {
			// if trait already exists then just update it
			if (this.#map.has(name)) {
				const instance = this.#map.get(name);

				if (!instance)
					return console.error(__filename, `${this.#typeName} with name '${name}' is not defined but key exists`);

				// todo add on change handler call
				instance.value = value;
			} else {
				// todo add on change handler call for new trait
				// else add new trait instance
				this.#map.set(name, this.#instanceCreator(name, value));
			}
		} else {
			console.error(__filename, `set${this.#typeName} error: bad inputs`, { attribute: name, value });
		}
	}
}

import { TraitNameUnionOrString } from './../../declarations/types';
import { iCanHaveSaveAction } from './../../declarations/interfaces/general-interfaces';
import { iCharacterSheet } from './../../declarations/interfaces/character-sheet-interfaces';
import { TraitValueTypeUnion } from '../../declarations/types';
import { iTraitDataStorageProps, iTraitDataStorage } from '../../declarations/interfaces/data-storage-interfaces';
import AbstractDataStorage from './AbstractDataStorage';
import AbstractTraitDataStorage from './AbstractTraitDataStorage';

// ? does this need to be a separate interface
interface iPrivateModifiableProperties<V extends TraitValueTypeUnion> extends iCanHaveSaveAction {
	value: V;
}

interface iProps<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion> extends iCanHaveSaveAction {
	name: N;
	initialValue: V;
}
export default class LocalTraitDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion
> extends AbstractTraitDataStorage<N, V> {
	#private: iPrivateModifiableProperties<V>;

	readonly name: N;
	constructor(props: iTraitDataStorageProps<N, V>) {
		super();

		const { value, name, defaultValue } = props;

		this.name = name;

		
		this.#private = {
			value: value || defaultValue, // save initial value or default value if initial is not defined
		};
	}

	get value(): V {
		return this.#private.value;
	}
	set value(newValue: V) {
		// get current value as old value
		const oldValue = this.#private.value;

		// do nothing if values are the same
		if (newValue === oldValue) return;

		// update internal value
		this.#private.value = newValue;

		// save change
		this.save();

		// attempt autosave for change
		this.save()
			? console.log(__filename, `Successfully saved "${this.name}" trait property change`, { oldValue, newValue })
			: console.error(__filename, `Error while saving "${this.name}" trait property change`, { oldValue, newValue });
	}
	save(): boolean {
		// save if available
		return this.#private.saveAction ? this.#private.saveAction() : false;
	}
}

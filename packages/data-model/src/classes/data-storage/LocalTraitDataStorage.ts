import { TraitNameUnionOrString } from './../../declarations/types';
import { iCanHaveSaveAction } from './../../declarations/interfaces/general-interfaces';
import { iCharacterSheet } from './../../declarations/interfaces/character-sheet-interfaces';
import { TraitValueTypeUnion } from '../../declarations/types';
import { iTraitDataStorage } from '../../declarations/interfaces/data-storage-interfaces';
import AbstractDataStorage from './AbstractDataStorage';
import AbstractTraitDataStorage from './AbstractTraitDataStorage';

interface iPrivateModifiableProperties<V extends TraitValueTypeUnion> extends iCanHaveSaveAction {
	value: V;
}

interface iProps<V extends TraitValueTypeUnion> extends iCanHaveSaveAction {
	initialValue: V;
}
export default class LocalTraitDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion
> extends AbstractTraitDataStorage<N, V> {
	#private: iPrivateModifiableProperties<V>;
	constructor(props: iProps<V>) {
		super();

		const { initialValue, saveAction } = props;

		this.#private = {
			value: initialValue,
			saveAction,
		};
	}
	get value(): V {
		return this.#private.value;
	}
	set value(newValue: V) {
		// do nothing if values are the same
		if (newValue === this.#private.value) return;

		// update internal value
		this.#private.value = newValue;

		// save change
		this.save()
	}
	save(): boolean {
		// save if available  
    return this.#private.saveAction ? this.#private.saveAction() : false
	}
}

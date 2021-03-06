import { TraitNameUnionOrString } from './../../declarations/types';
import { iCanHaveSaveAction, iHasSaveAction } from './../../declarations/interfaces/general-interfaces';
import { iCharacterSheet } from './../../declarations/interfaces/character-sheet-interfaces';
import { TraitValueTypeUnion } from '../../declarations/types';
import { iLocalTraitDataStorageProps, iTraitDataStorage } from '../../declarations/interfaces/data-storage-interfaces';
import AbstractDataStorage from './AbstractDataStorage';
import AbstractTraitDataStorage from './AbstractTraitDataStorage';
import saveCharacterSheetToFile from '../../utils/saveCharacterSheetToFile';


// ? does this need to be a separate interface
interface iPrivateModifiableProperties<V extends TraitValueTypeUnion> {
	value: V;
	characterSheet: iCharacterSheet;
}

export default class LocalTraitDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion
> extends AbstractTraitDataStorage<N, V> {
	#private: iPrivateModifiableProperties<V>;

	readonly name: N;

	constructor(props: iLocalTraitDataStorageProps<N, V>) {
		super();

		const { value, name, defaultValue, characterSheet } = props;

		this.name = name;

		this.#private = {
			value: value || defaultValue, // save initial value or default value if initial is not defined
			characterSheet,
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
		return saveCharacterSheetToFile(this.#private.characterSheet.toJson(), '../../data/character-sheets');
	}
}

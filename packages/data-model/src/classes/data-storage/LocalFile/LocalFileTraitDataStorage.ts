import { iCharacterSheet } from '../../../declarations/interfaces/character-sheet-interfaces';
import { iLocalTraitDataStorageProps } from '../../../declarations/interfaces/data-storage-interfaces';
import { TraitValueTypeUnion, TraitNameUnionOrString } from '../../../declarations/types';
import saveCharacterSheetToFile from '../../../utils/saveCharacterSheetToFile';
import AbstractTraitDataStorage from '../AbstractTraitDataStorage';

// ? does this need to be a separate interface
interface iPrivateModifiableProperties<V extends TraitValueTypeUnion> {
	value: V;
}

export default class LocalFileTraitDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion
> extends AbstractTraitDataStorage<N, V> {
	#private: iPrivateModifiableProperties<V>;
	#characterSheet: iCharacterSheet;
	readonly name: N;

	constructor(props: iLocalTraitDataStorageProps<N, V>) {
		super();

		const { name, defaultValueIfNotDefined, characterSheet } = props;

		this.name = name;
		this.#characterSheet = characterSheet;

		this.#private = {
			value: defaultValueIfNotDefined, // save initial value or default value if initial is not defined
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

		// attempt autosave for change
		this.save()
			? console.log(__filename, `Successfully saved "${this.name}" trait property change`, { oldValue, newValue })
			: console.error(__filename, `Error while saving "${this.name}" trait property change`, { oldValue, newValue });
	}
	private save(): boolean {
		// save if available
		return saveCharacterSheetToFile(
			this.#characterSheet.toJson(),
			`../../data/character-sheets/${this.#characterSheet.discordUserId}`
		);
	}
}

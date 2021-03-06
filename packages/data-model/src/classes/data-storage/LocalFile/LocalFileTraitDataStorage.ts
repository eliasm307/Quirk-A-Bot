import { iCharacterSheet } from '../../../declarations/interfaces/character-sheet-interfaces';
import { iLocalTraitDataStorageProps } from '../../../declarations/interfaces/data-storage-interfaces';
import { TraitValueTypeUnion, TraitNameUnionOrString } from '../../../declarations/types';
import saveCharacterSheetToFile from '../../../utils/saveCharacterSheetToFile';
import AbstractTraitDataStorage from '../AbstractTraitDataStorage';
import InMemoryTraitDataStorage from '../InMemory/InMemoryTraitDataStorage';

export default class LocalFileTraitDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion
> extends InMemoryTraitDataStorage<N, V> {
	#characterSheet: iCharacterSheet;

	constructor(props: iLocalTraitDataStorageProps<N, V>) {
		super(props);
		const { characterSheet } = props;
		this.#characterSheet = characterSheet;
	}
	protected save(): boolean {
		// save if available
		return saveCharacterSheetToFile(
			this.#characterSheet.toJson(),
			`../../data/character-sheets/${this.#characterSheet.discordUserId}`
		);
	}
}
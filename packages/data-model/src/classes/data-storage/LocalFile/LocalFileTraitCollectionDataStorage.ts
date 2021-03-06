import { iLocalFileTraitCollectionDataStorageProps } from './../../../declarations/interfaces/data-storage-interfaces';
import { iCharacterSheet } from './../../../declarations/interfaces/character-sheet-interfaces';
import { iBaseTrait, iTraitData } from '../../../declarations/interfaces/trait-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import saveCharacterSheetToFile from '../../../utils/saveCharacterSheetToFile';
import InMemoryTraitCollectionDataStorage from '../InMemory/InMemoryTraitCollectionDataStorage';
import path from 'path';

export default class LocalFileTraitCollectionDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends InMemoryTraitCollectionDataStorage<N, V, D, T> {
	#characterSheet: iCharacterSheet;

	constructor(props: iLocalFileTraitCollectionDataStorageProps<N, V, D, T>) {
		super(props);
		const { characterSheet } = props;
		this.#characterSheet = characterSheet;
	}

	save(): boolean {
		// save if available
		return saveCharacterSheetToFile(
			this.#characterSheet.toJson(),
			path.resolve(`../../../data/character-sheets/${this.#characterSheet.discordUserId}.json`)
		);
	}
}

import path from 'path';
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

		if(!this.#characterSheet) throw Error(`${__filename} characterSheet is not defined`)
	}
	protected save(): boolean {

		const resolvedPath = path.resolve( `../../../data/character-sheets/${ this.#characterSheet.discordUserId }.json` )
		
		console.log(__filename, "Save",  {resolvedPath, characterSheet: this.#characterSheet})

		// save if available
		return saveCharacterSheetToFile(
			this.#characterSheet.toJson(),
			resolvedPath
		);
	}
}

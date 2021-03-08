import path from 'path';
import { iCharacterSheet } from '../../../declarations/interfaces/character-sheet-interfaces';
import { iLocalFileTraitDataStorageProps, iTraitDataStorage } from '../../../declarations/interfaces/data-storage-interfaces';
import { TraitValueTypeUnion, TraitNameUnionOrString } from '../../../declarations/types';
import saveCharacterSheetToFile from '../../../utils/saveCharacterSheetToFile'; 
import InMemoryTraitDataStorage from '../InMemory/InMemoryTraitDataStorage';

export default class LocalFileTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends InMemoryTraitDataStorage<N, V>
	implements iTraitDataStorage<N, V> {
	#characterSheet: iCharacterSheet;
	#resolvedBasePath: string;
	constructor(props: iLocalFileTraitDataStorageProps<N, V>) {
		super(props);
		const { characterSheet, name, defaultValueIfNotDefined, resolvedBasePath } = props;
		this.#characterSheet = characterSheet;
		this.#resolvedBasePath = resolvedBasePath;

		if (!this.#characterSheet) throw Error(`${__filename} characterSheet is not defined`);
	}
	protected save(): boolean {
		const resolvedPath = path.resolve(this.#resolvedBasePath, `${this.#characterSheet.id}.json`);

		// console.warn(__filename, "Save",  {resolvedPath })

		// save if available
		return saveCharacterSheetToFile(this.#characterSheet.toJson(), resolvedPath);
	}
}

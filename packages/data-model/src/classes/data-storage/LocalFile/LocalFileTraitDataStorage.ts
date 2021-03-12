import path from 'path';
import { iCharacterSheet } from '../../../declarations/interfaces/character-sheet-interfaces';
import {
	iLocalFileTraitDataStorageProps,
	iBaseTraitDataStorage,
} from '../../../declarations/interfaces/data-storage-interfaces';
import { iBaseTraitData } from '../../../declarations/interfaces/trait-interfaces';
import { TraitValueTypeUnion, TraitNameUnionOrString } from '../../../declarations/types';
import { createPath } from '../../../utils/createPath';
import saveCharacterSheetToFile from '../../../utils/saveCharacterSheetToFile';
import AbstractTraitDataStorage from '../AbstractTraitDataStorage';

export default class LocalFileTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends AbstractTraitDataStorage<N, V>
	implements iBaseTraitDataStorage<N, V> {
	#characterSheet: iCharacterSheet;
	#resolvedFilePath: string;
	path: string;

	constructor(props: iLocalFileTraitDataStorageProps<N, V>) {
		super(props);
		const { characterSheet, resolvedBasePath, name, parentPath } = props;
		this.path = createPath(parentPath, name)

		// ? is this required, needed to do some debugging before
		if (!characterSheet) throw Error(`characterSheet is not defined`);

		this.#characterSheet = characterSheet;
		this.#resolvedFilePath = path.resolve(resolvedBasePath, `${characterSheet.id}.json`);
	}

	protected afterValueChange(): boolean {
		// auto save character sheet to file
		return saveCharacterSheetToFile(this.#characterSheet.toJson(), this.#resolvedFilePath);
	}
}

import path from 'path';

import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import { iCharacterSheet } from '../../characterSheet/interfaces/character-sheet-interfaces';
import AbstractTraitDataStorage from '../AbstractTraitDataStorage';
import { iBaseTraitDataStorage } from '../interfaces/data-storage-interfaces';
import { iLocalFileTraitDataStorageProps } from '../interfaces/props/trait-data-storage';
import { createPath } from '../utils/createPath';
import saveCharacterSheetToFile from './utils/saveCharacterSheetToFile';

export default class LocalFileTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends AbstractTraitDataStorage<N, V>
	implements iBaseTraitDataStorage<N, V> {
	#characterSheet: iCharacterSheet;
	#resolvedFilePath: string;
	path: string;

	constructor(props: iLocalFileTraitDataStorageProps<N, V>) {
		super(props);
		const { characterSheet, resolvedBasePath, name, parentPath } = props;
		this.path = createPath(parentPath, name);

		// ? is this required, needed to do some debugging before
		if (!characterSheet) throw Error(`characterSheet is not defined`);

		this.#characterSheet = characterSheet;
		this.#resolvedFilePath = path.resolve(resolvedBasePath, `${characterSheet.id}.json`);
	}

	cleanUp(): boolean {
		// do nothing
		return true;
	}

	protected afterValueChange(): boolean {
		// auto save character sheet to file
		return saveCharacterSheetToFile(this.#characterSheet.data(), this.#resolvedFilePath);
	}
}

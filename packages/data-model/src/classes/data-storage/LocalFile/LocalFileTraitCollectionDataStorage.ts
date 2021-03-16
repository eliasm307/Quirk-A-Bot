import path from 'path';

import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import { iCharacterSheet } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iBaseTrait, iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import AbstractTraitCollectionDataStorage from '../AbstractTraitCollectionDataStorage';
import {
  iLocalFileTraitCollectionDataStorageProps
} from '../interfaces/props/trait-collection-data-storage';
import saveCharacterSheetToFile from './utils/saveCharacterSheetToFile';

export default class LocalFileTraitCollectionDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends AbstractTraitCollectionDataStorage<N, V, D, T> {
	#characterSheet: iCharacterSheet;
	#resolvedBasePath: string;

	constructor(props: iLocalFileTraitCollectionDataStorageProps<N, V, D, T>) {
		super(props);
		const { characterSheet, resolvedBasePath } = props;
		this.#characterSheet = characterSheet;
		this.#resolvedBasePath = resolvedBasePath;
	}

	protected afterAddInternal(name: N): void {
		this.save();
	}

	protected afterTraitCleanUp(): boolean {
		// do nothing
		return true;
	}

	protected deleteTraitFromDataStorage(name: N): void {
		this.save();
	}

	protected save(): boolean {
		// save if available
		return saveCharacterSheetToFile(
			this.#characterSheet.data(),
			path.resolve(this.#resolvedBasePath, `${this.#characterSheet.id}.json`)
		);
	}
}

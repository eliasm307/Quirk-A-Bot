import { iLocalFileTraitCollectionDataStorageProps } from './../../../declarations/interfaces/data-storage-interfaces';
import { iCharacterSheet } from './../../../declarations/interfaces/character-sheet-interfaces';
import { iBaseTrait, iBaseTraitData } from '../../../declarations/interfaces/trait-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import saveCharacterSheetToFile from '../../../utils/saveCharacterSheetToFile';
import InMemoryTraitCollectionDataStorage from '../InMemory/InMemoryTraitCollectionDataStorage';
import path from 'path';
import AbstractTraitCollectionDataStorage from '../AbstractTraitCollectionDataStorage';

export default class LocalFileTraitCollectionDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends AbstractTraitCollectionDataStorage<N, V, D, T> {
	protected addTraitToDataStorage(name: N): void {
		this.save();
	}
	protected deleteTraitFromDataStorage(name: N): void {
		this.save();
	}
	#characterSheet: iCharacterSheet;
	#resolvedBasePath: string;

	constructor(props: iLocalFileTraitCollectionDataStorageProps<N, V, D, T>) {
		super(props);
		const { characterSheet, resolvedBasePath } = props;
		this.#characterSheet = characterSheet;
		this.#resolvedBasePath = resolvedBasePath;
	}

	protected save(): boolean {
		// save if available
		return saveCharacterSheetToFile(
			this.#characterSheet.toJson(),
			path.resolve(this.#resolvedBasePath, `${this.#characterSheet.id}.json`)
		);
	}
}

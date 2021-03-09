import path from 'path';
import { iCharacterSheet } from '../../../declarations/interfaces/character-sheet-interfaces';
import {
	iLocalFileTraitDataStorageProps,
	iTraitDataStorage,
} from '../../../declarations/interfaces/data-storage-interfaces';
import { iBaseTraitData } from '../../../declarations/interfaces/trait-interfaces';
import { TraitValueTypeUnion, TraitNameUnionOrString } from '../../../declarations/types';
import saveCharacterSheetToFile from '../../../utils/saveCharacterSheetToFile';
import AbstractTraitDataStorage from '../AbstractTraitDataStorage';

export default class LocalFileTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends AbstractTraitDataStorage<N, V>
	implements iTraitDataStorage<N, V> {
	protected assertTraitExistsOnDataStorage( { }: iBaseTraitData<N, V> ): void {
		// todo implement this
	}
	#resolvedFilePath: string;
	#characterSheet: iCharacterSheet;
	constructor(props: iLocalFileTraitDataStorageProps<N, V>) {
		super(props);
		const { characterSheet, resolvedBasePath } = props;

		// ? is this required, needed to do some debugging before
		if (!characterSheet) throw Error(`${__filename} characterSheet is not defined`);

		this.#characterSheet = characterSheet;
		this.#resolvedFilePath = path.resolve(resolvedBasePath, `${characterSheet.id}.json`);
	}
	protected afterValueChange(): boolean {
		// auto save character sheet to file
		return saveCharacterSheetToFile(this.#characterSheet.toJson(), this.#resolvedFilePath);
	}
}

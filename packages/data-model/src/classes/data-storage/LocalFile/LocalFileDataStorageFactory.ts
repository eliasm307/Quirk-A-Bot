import { iLocalFileDataStorageFactoryProps } from './../../../declarations/interfaces/data-storage-interfaces';
import { iCharacterSheet, iCharacterSheetData } from './../../../declarations/interfaces/character-sheet-interfaces';
import { TraitValueTypeUnion } from '../../../declarations/types';
import {
	iBaseTraitCollectionDataStorageProps,
	iBaseTraitDataStorageProps,
	iDataStorageFactory,
	iTraitCollectionDataStorage,
	iTraitDataStorage,
} from '../../../declarations/interfaces/data-storage-interfaces';
import LocalFileTraitDataStorage from './LocalFileTraitDataStorage';
import { iTraitData, iBaseTrait } from '../../../declarations/interfaces/trait-interfaces';
import LocalFileTraitCollectionDataStorage from './LocalFileTraitCollectionDataStorage';
import AbstractDataStorageFactory from '../AbstractDataStorageFactory';
import path from 'path';
import fs from 'fs-extra';
import CharacterSheet from '../../CharacterSheet';
import importDataFromFile from '../../../utils/importDataFromFile';
import { isCharacterSheetData } from '../../../utils/typePredicates';
export default class LocalFileDataStorageFactory extends AbstractDataStorageFactory implements iDataStorageFactory {
	#resolvedFilePath: string;
	protected characterSheetExists(id: string): boolean {
		return fs.pathExistsSync(this.#resolvedFilePath); // check file path exists
	}
	protected getCharacterSheetData(id: string): iCharacterSheetData {
		// todo add option to create blank instance at the specified path if it doesnt exist?
		const data = importDataFromFile(this.#resolvedFilePath);

		if (!data) throw Error(`Error importing charactersheet data from ${this.#resolvedFilePath}`);

		console.log(`Data imported from ${this.#resolvedFilePath}`, { data });

		if (!isCharacterSheetData(data))
			throw Error(`Data loaded from path "${this.#resolvedFilePath}" is not valid character sheet data`);

		return data;
	}
	constructor({ id }: iLocalFileDataStorageFactoryProps) {
		super({ id });
		// get path relative to character sheet data folder
		this.#resolvedFilePath = path.resolve(__dirname, '../../../data/character-sheets/', id);
	}
	newTraitCollectionDataStorage<
		N extends string,
		V extends TraitValueTypeUnion,
		D extends iTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(props: iBaseTraitCollectionDataStorageProps<N, V, D, T>): iTraitCollectionDataStorage<N, V, D, T> {
		return new LocalFileTraitCollectionDataStorage({ ...props, characterSheet: this.characterSheet });
	}

	newTraitDataStorageInitialiser<N extends string, V extends TraitValueTypeUnion>(): (
		props: iBaseTraitDataStorageProps<N, V>
	) => iTraitDataStorage<N, V> {
		return props => new LocalFileTraitDataStorage({ ...props, characterSheet: this.characterSheet });
	}

	newTraitCollectionDataStorageInitialiser<
		N extends string,
		V extends TraitValueTypeUnion,
		D extends iTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(): (props: iBaseTraitCollectionDataStorageProps<N, V, D, T>) => iTraitCollectionDataStorage<N, V, D, T> {
		return props => new LocalFileTraitCollectionDataStorage({ ...props, characterSheet: this.characterSheet });
	}
}

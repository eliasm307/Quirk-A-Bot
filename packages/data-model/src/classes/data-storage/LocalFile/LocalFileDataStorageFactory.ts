 
import {
  iBaseCharacterSheetDataStorageFactoryMethodProps, iBaseTraitCollectionDataStorageProps,
  iBaseTraitDataStorage, iBaseTraitDataStorageProps, iCharacterSheetDataStorage,
  iDataStorageFactory, iLocalFileDataStorageFactoryProps, iTraitCollectionDataStorage
} from '../interfaces/data-storage-interfaces';
import { iBaseTrait, iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import { TraitValueTypeUnion } from '../../../declarations/types';
import LocalFileCharacterSheetDataStorage from './LocalFileCharacterSheetDataStorage';
import LocalFileTraitCollectionDataStorage from './LocalFileTraitCollectionDataStorage';
import LocalFileTraitDataStorage from './LocalFileTraitDataStorage';
import { iHasCharacterSheet } from '../../characterSheet/interfaces/character-sheet-interfaces';

export default class LocalFileDataStorageFactory implements iDataStorageFactory {
  #resolvedBasePath: string;

  constructor({ resolvedBasePath }: iLocalFileDataStorageFactoryProps) {
		this.#resolvedBasePath = resolvedBasePath;
	}

  newCharacterSheetDataStorage(props: iBaseCharacterSheetDataStorageFactoryMethodProps): iCharacterSheetDataStorage {
		return new LocalFileCharacterSheetDataStorage({
			...props,
			dataStorageFactory: this,
			resolvedBasePath: this.#resolvedBasePath,
		});
	}

  newTraitCollectionDataStorageInitialiser({
		characterSheet,
	}: iHasCharacterSheet): <
		N extends string,
		V extends TraitValueTypeUnion,
		D extends iBaseTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(
		props: iBaseTraitCollectionDataStorageProps<N, V, D, T>
	) => iTraitCollectionDataStorage<N, V, D, T> {
		return props =>
			new LocalFileTraitCollectionDataStorage({ ...props, characterSheet, resolvedBasePath: this.#resolvedBasePath });
	}

  newTraitDataStorageInitialiser({
		characterSheet,
	}: iHasCharacterSheet): <N extends string, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iBaseTraitDataStorage<N, V> {
		return props =>
			new LocalFileTraitDataStorage({ ...props, characterSheet, resolvedBasePath: this.#resolvedBasePath });
	}
}

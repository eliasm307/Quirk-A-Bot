import {
	iCharacterSheetDataStorage,
	iLocalFileDataStorageFactoryProps,
	iHasCharacterSheet,
	iHasId,
} from './../../../declarations/interfaces/data-storage-interfaces';
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
import LocalFileCharacterSheetDataStorage from './LocalFileCharacterSheetDataStorage';
export default class LocalFileDataStorageFactory implements iDataStorageFactory {
	#resolvedBasePath: string;

	constructor({ resolvedBasePath }: iLocalFileDataStorageFactoryProps) {
		this.#resolvedBasePath = resolvedBasePath;
	}
	newCharacterSheetDataStorage({ id }: iHasId): iCharacterSheetDataStorage {
		return new LocalFileCharacterSheetDataStorage({
			id,
			dataStorageFactory: this,
			resolvedBasePath: this.#resolvedBasePath,
		});
	}

	newTraitDataStorageInitialiser({
		characterSheet,
	}: iHasCharacterSheet): <N extends string, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iTraitDataStorage<N, V> {
		return props =>
			new LocalFileTraitDataStorage({ ...props, characterSheet, resolvedBasePath: this.#resolvedBasePath });
	}

	newTraitCollectionDataStorageInitialiser({
		characterSheet,
	}: iHasCharacterSheet): <
		N extends string,
		V extends TraitValueTypeUnion,
		D extends iTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(
		props: iBaseTraitCollectionDataStorageProps<N, V, D, T>
	) => iTraitCollectionDataStorage<N, V, D, T> {
		return props => new LocalFileTraitCollectionDataStorage({ ...props, characterSheet });
	}
}

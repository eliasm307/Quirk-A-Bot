import {
	iBaseCharacterSheetDataStorageFactoryMethodProps,
	iCharacterSheetDataStorage,
	iHasId,
	iInMemoryFileDataStorageFactoryProps,
} from '../interfaces/data-storage-interfaces';
import { TraitNameUnionOrString } from '../../../declarations/types';
import { TraitValueTypeUnion } from '../../../declarations/types';
import {
	iBaseTraitCollectionDataStorageProps,
	iBaseTraitDataStorageProps,
	iDataStorageFactory,
	iTraitCollectionDataStorage,
	iBaseTraitDataStorage,
} from '../interfaces/data-storage-interfaces';
import InMemoryTraitDataStorage from './InMemoryTraitDataStorage';
import { iBaseTraitData, iBaseTrait } from '../../traits/interfaces/trait-interfaces';
import InMemoryTraitCollectionDataStorage from './InMemoryTraitCollectionDataStorage';
import InMemoryCharacterSheetDataStorage from './InMemoryCharacterSheetDataStorage';

export default class InMemoryDataStorageFactory implements iDataStorageFactory {
	constructor(props?: iInMemoryFileDataStorageFactoryProps) {}

	newCharacterSheetDataStorage(props: iBaseCharacterSheetDataStorageFactoryMethodProps): iCharacterSheetDataStorage {
		return new InMemoryCharacterSheetDataStorage({ ...props, dataStorageFactory: this });
	}

	newTraitCollectionDataStorageInitialiser(): <
		N extends string,
		V extends TraitValueTypeUnion,
		D extends iBaseTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(
		props: iBaseTraitCollectionDataStorageProps<N, V, D, T>
	) => iTraitCollectionDataStorage<N, V, D, T> {
		return props => new InMemoryTraitCollectionDataStorage({ ...props });
	}

	newTraitDataStorageInitialiser(): <N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iBaseTraitDataStorage<N, V> {
		return props => new InMemoryTraitDataStorage({ ...props });
	}
}

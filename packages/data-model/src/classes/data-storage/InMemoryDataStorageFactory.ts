import { TraitValueTypeUnion } from '../../declarations/types';
import {
	iBaseTraitDataStorageProps,
	iDataStorageFactory,
	iTraitDataStorage,
} from './../../declarations/interfaces/data-storage-interfaces';
import InMemoryTraitDataStorage from './InMemoryTraitDataStorage';
export default class InMemoryDataStorageFactory implements iDataStorageFactory {
	traitDataStorageInitialiser<N extends string, V extends TraitValueTypeUnion>(): (
		props: iBaseTraitDataStorageProps<N, V>
	) => iTraitDataStorage<N, V> {
		return props => new InMemoryTraitDataStorage({ ...props });
	}
}

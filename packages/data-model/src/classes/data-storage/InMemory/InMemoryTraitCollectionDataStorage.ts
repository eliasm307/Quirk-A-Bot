import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import { iBaseTrait, iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import AbstractTraitCollectionDataStorage from '../AbstractTraitCollectionDataStorage';
import { iTraitCollectionDataStorage } from '../interfaces/data-storage-interfaces';

export default class InMemoryTraitCollectionDataStorage<
		N extends TraitNameUnionOrString,
		V extends TraitValueTypeUnion,
		D extends iBaseTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>
	extends AbstractTraitCollectionDataStorage<N, V, D, T>
	implements iTraitCollectionDataStorage<N, V, D, T> {
	// todo these methods should be optional arguments for the base class, use strategy pattern
	protected afterAddInternal(name: N): void {
		// do nothing
	}

	protected afterTraitCleanUp(): boolean {
		// do nothing
		return true;
	}

	protected deleteTraitFromDataStorage(name: N): void {
		// do nothing
	}
}

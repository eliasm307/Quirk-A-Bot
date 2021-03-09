import { iTraitDataStorage } from './../../../declarations/interfaces/data-storage-interfaces';
import { throws } from 'node:assert';
import { iInMemoryTraitDataStorageProps } from '../../../declarations/interfaces/data-storage-interfaces';
import { TraitValueTypeUnion, TraitNameUnionOrString } from '../../../declarations/types';
import AbstractTraitDataStorage from '../AbstractTraitDataStorage';
import { iBaseTraitData } from '../../../declarations/interfaces/trait-interfaces';

// ? does this need to be a separate interface

export default class InMemoryTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends AbstractTraitDataStorage<N, V>
	implements iTraitDataStorage<N, V> {
	protected assertTraitExistsOnDataStorage({}: iBaseTraitData<N, V>): void {
		// todo implement this
	}
	protected afterValueChange(): void {
		// do nothing
	}
}

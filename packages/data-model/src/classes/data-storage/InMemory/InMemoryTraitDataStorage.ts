import { iBaseTraitDataStorage, iBaseTraitDataStorageProps } from '../interfaces/data-storage-interfaces';
import { throws } from 'node:assert';
import { iInMemoryTraitDataStorageProps } from '../interfaces/data-storage-interfaces';
import { TraitValueTypeUnion, TraitNameUnionOrString } from '../../../declarations/types';
import AbstractTraitDataStorage from '../AbstractTraitDataStorage';
import { iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import { createPath } from '../../../utils/createPath';

// ? does this need to be a separate interface

export default class InMemoryTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends AbstractTraitDataStorage<N, V>
	implements iBaseTraitDataStorage<N, V> {
	path: string;
	constructor (props: iBaseTraitDataStorageProps<N, V>) {
		super( props )
		const { name, parentPath } = props
		this.path = createPath(parentPath, name);
	}
	protected assertTraitExistsOnDataStorage({}: iBaseTraitData<N, V>): void {
		// todo implement this
	}
	protected afterValueChange(): void {
		// do nothing
	}
}

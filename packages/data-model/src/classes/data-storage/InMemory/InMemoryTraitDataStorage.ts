import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import { iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import AbstractTraitDataStorage from '../AbstractTraitDataStorage';
import {
  iBaseTraitDataStorage, iBaseTraitDataStorageProps
} from '../interfaces/data-storage-interfaces';
import { createPath } from '../utils/createPath';

// ? does this need to be a separate interface

export default class InMemoryTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends AbstractTraitDataStorage<N, V>
	implements iBaseTraitDataStorage<N, V> {
	path: string;

	constructor(props: iBaseTraitDataStorageProps<N, V>) {
		super(props);
		const { name, parentPath } = props;
		this.path = createPath(parentPath, name);
	}

	cleanUp(): boolean {
		// do nothing
		return true;
	}

	protected afterValueChange(): void {
		// do nothing
	}

	protected assertTraitExistsOnDataStorage({}: iBaseTraitData<N, V>): void {
		// do nothing, always starts from default for in memory
	}
}

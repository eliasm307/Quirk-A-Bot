import { iGeneralTraitData } from './../../declarations/interfaces/trait-interfaces';
import { iTraitCollectionDataStorage } from './../../declarations/interfaces/data-storage-interfaces';
import { iTraitCollection } from './../../declarations/interfaces/trait-collection-interfaces';
import { TraitNameUnionOrString } from './../../declarations/types';
import { TraitValueTypeUnion } from '../../declarations/types';
import { iTraitDataStorage } from '../../declarations/interfaces/data-storage-interfaces';
import AbstractDataStorage from './AbstractDataStorage';

// todo delete?
export default abstract class AbstractTraitCollectionDataStorage<
		N extends TraitNameUnionOrString,
		D extends iGeneralTraitData
	>
	extends AbstractDataStorage
	implements iTraitCollectionDataStorage<N, D> {
	abstract get(key: N): void | D;
	abstract set(key: N, value: D): void;
	abstract delete(key: N): void;
	abstract has(key: N): boolean;
	abstract toArray(): D[];
	abstract size: number;
	abstract name: N;
	abstract save(): boolean;
}

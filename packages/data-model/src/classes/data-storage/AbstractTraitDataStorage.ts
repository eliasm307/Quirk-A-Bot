import { TraitNameUnionOrString } from './../../declarations/types';
import { TraitValueTypeUnion } from '../../declarations/types';
import { iTraitDataStorage } from '../../declarations/interfaces/data-storage-interfaces';

// todo delete?
export default abstract class AbstractTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	implements iTraitDataStorage<N, V> {
	abstract name: N;
	abstract value: V;
}

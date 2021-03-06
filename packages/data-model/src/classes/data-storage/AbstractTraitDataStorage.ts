import { TraitNameUnionOrString } from './../../declarations/types';
import { TraitValueTypeUnion } from '../../declarations/types';
import { iTraitDataStorage } from '../../declarations/interfaces/data-storage-interfaces';
import AbstractDataStorage from './AbstractDataStorage';

export default abstract class AbstractTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends AbstractDataStorage
	implements iTraitDataStorage<N, V> {
	abstract name: N;
	abstract value: V;
	abstract save(): boolean;
}

import { iTraitCollectionDataStorage } from '../../../declarations/interfaces/data-storage-interfaces';
import { iGeneralTraitData } from '../../../declarations/interfaces/trait-interfaces';
import { TraitNameUnionOrString } from '../../../declarations/types';
import AbstractDataStorage from '../AbstractDataStorage';

export default class LocalFileTraitCollectionDataStorage<N extends TraitNameUnionOrString, D extends iGeneralTraitData>
	extends AbstractDataStorage
	implements iTraitCollectionDataStorage<N, D> {
	get(key: N): void | D;
	set(key: N, value: D): void;
	delete(key: N): void;
	has(key: N): boolean;
	toArray(): D[];
	size: number;
	name: N;
	save(): boolean;
}

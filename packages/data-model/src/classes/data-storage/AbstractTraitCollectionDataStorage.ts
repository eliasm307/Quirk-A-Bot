import { iAddLogEventProps, iDeleteLogEventProps } from './../../declarations/interfaces/log-interfaces';
import { iBaseTrait, iGeneralTraitData, iTraitData } from './../../declarations/interfaces/trait-interfaces';
import { iTraitCollectionDataStorage } from './../../declarations/interfaces/data-storage-interfaces';
import { iTraitCollection } from './../../declarations/interfaces/trait-collection-interfaces';
import { TraitNameUnionOrString } from './../../declarations/types';
import { TraitValueTypeUnion } from '../../declarations/types';
import { iTraitDataStorage } from '../../declarations/interfaces/data-storage-interfaces';
import AbstractDataStorage from './AbstractDataStorage';
import { iLogReport, iLogEvent } from '../../declarations/interfaces/log-interfaces';

// todo delete?
export default abstract class AbstractTraitCollectionDataStorage<
		N extends TraitNameUnionOrString,
		V extends TraitValueTypeUnion,
		D extends iTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>
	extends AbstractDataStorage
	implements iTraitCollectionDataStorage<N, V, D, T> {
	abstract name: string;
	abstract toJson(): D[];
	abstract getLogReport(): iLogReport[];
	abstract getLogEvents(): iLogEvent[];
	protected abstract map: Map<N, T>;
	get(key: N): T | void {
		return this.map.get(key);
	}
	abstract set(key: N, value: V): void;
	abstract delete(key: N): void;
	abstract has(key: N): boolean;
	abstract toArray(): T[];
	abstract size: number;
	protected abstract onAdd(props: iAddLogEventProps<V>): void;
	protected abstract onDelete(props: iDeleteLogEventProps<V>): void;
}

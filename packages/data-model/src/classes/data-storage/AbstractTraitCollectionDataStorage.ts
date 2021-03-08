import { iAddLogEventProps, iDeleteLogEventProps } from './../../declarations/interfaces/log-interfaces';
import { iBaseTrait, iTraitData } from './../../declarations/interfaces/trait-interfaces';
import { iTraitCollectionDataStorage } from './../../declarations/interfaces/data-storage-interfaces';
import { TraitNameUnionOrString } from './../../declarations/types';
import { TraitValueTypeUnion } from '../../declarations/types';
import { iLogReport, iLogEvent } from '../../declarations/interfaces/log-interfaces';

export default abstract class AbstractTraitCollectionDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> implements iTraitCollectionDataStorage<N, V, D, T> {
	abstract name: string;
	abstract toJson(): D[];
	abstract getLogReport(): iLogReport[];
	abstract getLogEvents(): iLogEvent[];
	protected abstract map: Map<N, T>;
	get(key: N): T | void {
		return this.map.get(key);
	}
	abstract set(key: N, value: V): iTraitCollectionDataStorage<N, V, D, T>;
	abstract delete(key: N): iTraitCollectionDataStorage<N, V, D, T>;
	abstract has(key: N): boolean;
	abstract toArray(): T[];
	abstract size: number;
	protected abstract onAdd(props: iAddLogEventProps<V>): void;
	protected abstract onDelete(props: iDeleteLogEventProps<V>): void;
}

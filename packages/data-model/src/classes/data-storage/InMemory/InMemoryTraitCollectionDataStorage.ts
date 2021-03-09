import pathModule from 'path';
import {
	iBaseTraitCollectionDataStorageProps,
	iBaseTraitDataStorageProps,
	iTraitCollectionDataStorage,
	iTraitDataStorage,
} from '../../../declarations/interfaces/data-storage-interfaces';
import {
	iAddLogEventProps,
	iDeleteLogEventProps,
	iLogEvent,
	iLogReport,
} from '../../../declarations/interfaces/log-interfaces';
import { iBaseTrait, iBaseTraitProps, iBaseTraitData } from '../../../declarations/interfaces/trait-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import AbstractTraitCollectionDataStorage from '../AbstractTraitCollectionDataStorage';

export default class InMemoryTraitCollectionDataStorage<
		N extends TraitNameUnionOrString,
		V extends TraitValueTypeUnion,
		D extends iBaseTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>
	extends AbstractTraitCollectionDataStorage<N, V, D, T>
	implements iTraitCollectionDataStorage<N, V, D, T> {
	protected afterAdd( name: N ): void {
		throw new Error( 'Method not implemented.' );
	}
	protected deleteTraitFromDataStorage( name: N ): void {
		throw new Error( 'Method not implemented.' );
	}
 
}

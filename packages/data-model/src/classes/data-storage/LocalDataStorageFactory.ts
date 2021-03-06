import { iCharacterSheet } from './../../declarations/interfaces/character-sheet-interfaces';
import { TraitValueTypeUnion } from '../../declarations/types';
import {
	iBaseTraitDataStorageProps,
	iDataStorageFactory,
	iTraitDataStorage,
} from './../../declarations/interfaces/data-storage-interfaces';
import LocalTraitDataStorage from './LocalTraitDataStorage';
export default class LocalDataStorageFactory implements iDataStorageFactory {
	constructor(public characterSheet: iCharacterSheet) {}

	newTraitDataStorageInitialiser<N extends string, V extends TraitValueTypeUnion>(): (
		props: iBaseTraitDataStorageProps<N, V>
	) => iTraitDataStorage<N, V> {
		return props => new LocalTraitDataStorage({ ...props, characterSheet: this.characterSheet });
	}
}

// -------------------------------------------------------

import {
  iHasFirestore, iHasParentPath, iHasResolvedBasePath,
} from '../../../../declarations/interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../../declarations/types';
import {
  iCharacterSheetOLD, iHasCharacterSheet,
} from '../../../character-sheet/interfaces/character-sheet-interfaces';
import {
  iAddLogEventProps, iDeleteLogEventProps, iTraitCollectionLogger,
} from '../../../log/interfaces/log-interfaces';
import {
  iBaseTrait, iBaseTraitData, iCanHaveLoggerCreator, iHasTraitInstanceCreator,
} from '../../../traits/interfaces/trait-interfaces';
import {
  iBaseTraitDataStorage, iHasDataStorageFactory, iHasTraitDataStorageInitialiser,
} from '../data-storage-interfaces';
import { iBaseTraitDataStorageProps } from './trait-data-storage';

export interface iTraitCollectionDataStorageInitialiserProps
  extends iHasCharacterSheet {}

// TRAIT COLLECTION DATA STORAGE PROPS
export interface iBaseTraitCollectionDataStorageProps<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion,
  D extends iBaseTraitData<N, V>,
  T extends iBaseTrait<N, V, D>
> extends iHasTraitInstanceCreator<N, V, D, T>,
    iHasDataStorageFactory,
    // iHasTraitDataStorageInitialiser<N, V>,
    iHasParentPath,
    iCanHaveLoggerCreator<iTraitCollectionLogger> {
  dataPredicate: (data: unknown) => data is D;
  initialData?: D[];
  name: string;
  namePredicate: (name: unknown) => name is N;
  onAdd?: (props: iAddLogEventProps<V>) => void;
  onDelete?: (props: iDeleteLogEventProps<V>) => void;
}

export interface iLocalFileTraitCollectionDataStorageProps<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion,
  D extends iBaseTraitData<N, V>,
  T extends iBaseTrait<N, V, D>
> extends iBaseTraitCollectionDataStorageProps<N, V, D, T>,
    iHasResolvedBasePath {
  characterSheet: iCharacterSheetOLD;
}
export interface iFirestoreTraitCollectionDataStorageProps<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion,
  D extends iBaseTraitData<N, V>,
  T extends iBaseTrait<N, V, D>
> extends iBaseTraitCollectionDataStorageProps<N, V, D, T>,
    iHasFirestore {}

export interface iFirestoreCompositeTraitCollectionDataStorageProps<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion,
  D extends iBaseTraitData<N, V>,
  T extends iBaseTrait<N, V, D>
> extends iBaseTraitCollectionDataStorageProps<N, V, D, T>,
    iHasFirestore {
  dataPredicate: (data: unknown) => data is D;
  namePredicate: (name: unknown) => name is N;
}

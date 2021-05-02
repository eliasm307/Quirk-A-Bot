// -------------------------------------------------------

import {
  iHasFirestore, iHasParentPath, iHasResolvedBasePath,
} from '../../../../declarations/interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../../declarations/types';
import { iCharacterSheet } from '../../../character-sheet/interfaces/character-sheet-interfaces';
import {
  iAddLogEventProps, iDeleteLogEventProps, iTraitCollectionLogger,
} from '../../../log/interfaces/log-interfaces';
import {
  iBaseTrait, iBaseTraitData, iCanHaveLoggerCreator, iHasTraitInstanceCreator,
} from '../../../traits/interfaces/trait-interfaces';
import { iHasTraitDataStorageInitialiser } from '../data-storage-interfaces';

// TRAIT COLLECTION DATA STORAGE PROPS
export interface iBaseTraitCollectionDataStorageProps<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion,
  D extends iBaseTraitData<N, V>,
  T extends iBaseTrait<N, V, D>
> extends iHasTraitInstanceCreator<N, V, D, T>,
    iHasTraitDataStorageInitialiser,
    iHasParentPath,
    iCanHaveLoggerCreator<iTraitCollectionLogger> {
  initialData?: D[];
  name: string;
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
  characterSheet: iCharacterSheet;
}
export interface iFirestoreTraitCollectionDataStorageProps<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion,
  D extends iBaseTraitData<N, V>,
  T extends iBaseTrait<N, V, D>
> extends iBaseTraitCollectionDataStorageProps<N, V, D, T>,
    iHasFirestore {}

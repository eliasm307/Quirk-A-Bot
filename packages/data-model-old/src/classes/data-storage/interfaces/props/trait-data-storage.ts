// -------------------------------------------------------
// TRAIT DATA STORAGE PROPS

import { iHasParentPath } from 'src/declarations/interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from 'src/declarations/types';

import { iHasCharacterSheet } from '../../../character-sheet/interfaces/character-sheet-interfaces';
import { iTraitLogger } from '../../../log/interfaces/log-interfaces';
import { iCanHaveLoggerCreator } from '../../../traits/interfaces/trait-interfaces';
import { iHasFirestore, iHasResolvedBasePath } from '../data-storage-interfaces';

export interface iBaseTraitDataStorageProps<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion
> extends iHasParentPath,
    iCanHaveLoggerCreator<iTraitLogger> {
  defaultValueIfNotDefined: V;
  name: N;
}

export interface iInMemoryTraitDataStorageProps<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion
> extends iBaseTraitDataStorageProps<N, V> {}

export interface iLocalFileTraitDataStorageProps<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion
> extends iBaseTraitDataStorageProps<N, V>,
    iHasCharacterSheet,
    iHasResolvedBasePath {}

export interface iFirestoreTraitDataStorageProps<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion
> extends iBaseTraitDataStorageProps<N, V>,
    iHasFirestore,
    iHasParentPath {}

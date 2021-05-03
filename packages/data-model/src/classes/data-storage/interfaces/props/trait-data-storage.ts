// -------------------------------------------------------
// TRAIT DATA STORAGE PROPS

import {
  iHasParentPath, SubDocument, TraitNameUnionOrString, TraitValueTypeUnion,
} from '@quirk-a-bot/common';

import { iHasFirestore, iHasResolvedBasePath } from '../../../../declarations/interfaces';
import { iHasCharacterSheet } from '../../../character-sheet/interfaces/character-sheet-interfaces';
import { iTraitLogger } from '../../../log/interfaces/log-interfaces';
import { iBaseTraitData, iCanHaveLoggerCreator } from '../../../traits/interfaces/trait-interfaces';

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

export interface iFirestoreCompositeTraitDataStorageProps<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion
> extends iBaseTraitDataStorageProps<N, V>,
    iHasFirestore,
    iHasParentPath {
  subDocument: SubDocument<Record<N, iBaseTraitData<N, V>>, N>;
}

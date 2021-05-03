import path from 'path';

import { CharacterSheet } from '../../..';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import { iCharacterSheet } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iBaseTrait, iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import AbstractTraitCollectionDataStorage from '../AbstractTraitCollectionDataStorage';
import { iBaseTraitDataStorage } from '../interfaces/data-storage-interfaces';
import {
  iLocalFileTraitCollectionDataStorageProps,
} from '../interfaces/props/trait-collection-data-storage';
import { iBaseTraitDataStorageProps } from '../interfaces/props/trait-data-storage';
import LocalFileTraitDataStorage from './LocalFileTraitDataStorage';
import saveCharacterSheetToFile from './utils/saveCharacterSheetToFile';

export default class LocalFileTraitCollectionDataStorage<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion,
  D extends iBaseTraitData<N, V>,
  T extends iBaseTrait<N, V, D>
> extends AbstractTraitCollectionDataStorage<N, V, D, T> {
  protected newTraitDataStorage: (
    props: iBaseTraitDataStorageProps<N, V>
  ) => iBaseTraitDataStorage<N, V>;

  #characterSheet: iCharacterSheet;
  #resolvedBasePath: string;

  constructor(props: iLocalFileTraitCollectionDataStorageProps<N, V, D, T>) {
    super(props);
    const { characterSheet, resolvedBasePath, dataStorageFactory } = props;
    this.#characterSheet = characterSheet;
    this.#resolvedBasePath = resolvedBasePath;
    this.newTraitDataStorage = (initialiserProps) => {
      return new LocalFileTraitDataStorage({
        ...initialiserProps,
        characterSheet: this.#characterSheet,
        resolvedBasePath: this.#resolvedBasePath,
      });
    };
  }

  protected afterAddInternal(name: N): void {
    this.save();
  }

  protected afterTraitCleanUp(): boolean {
    // do nothing
    return true;
  }

  protected async deleteTraitFromDataStorage(name: N) {
    this.save();
  }

  protected save(): boolean {
    // save if available
    return saveCharacterSheetToFile(
      this.#characterSheet.data(),
      path.resolve(this.#resolvedBasePath, `${this.#characterSheet.id}.json`)
    );
  }
}

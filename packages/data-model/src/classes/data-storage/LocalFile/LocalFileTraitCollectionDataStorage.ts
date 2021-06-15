import path from 'path';

import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import { iCharacterSheetOLD } from '../../character-sheet/interfaces/character-sheet-interfaces';
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
  #characterSheet: iCharacterSheetOLD;
  /** Resolved base path to characterSheet file */
  path: string;

  constructor(props: iLocalFileTraitCollectionDataStorageProps<N, V, D, T>) {
    super(props);
    const { characterSheet, resolvedBasePath, initialData } = props;
    this.#characterSheet = characterSheet;
    this.path = resolvedBasePath;
    this.setInitialData(initialData);
  }

  protected addTraitToDataStorage(_name: N): void {
    this.save();
  }

  protected afterTraitCleanUp(): boolean {
    // do nothing
    return true;
  }

  protected async deleteTraitFromDataStorage(_name: N) {
    this.save();
  }

  protected newTraitDataStorage: (
    props: iBaseTraitDataStorageProps<N, V>
  ) => iBaseTraitDataStorage<N, V> = (initialiserProps) =>
    new LocalFileTraitDataStorage({
      ...initialiserProps,
      characterSheet: this.#characterSheet,
      resolvedBasePath: this.path,
    });

  protected save(): boolean {
    return saveCharacterSheetToFile(
      this.#characterSheet.data(),
      path.resolve(this.path, `${this.#characterSheet.id}.json`)
    );
  }
}

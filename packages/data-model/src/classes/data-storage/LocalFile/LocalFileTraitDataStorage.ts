import path from 'path';

import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import { iCharacterSheet } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import AbstractTraitDataStorage from '../AbstractTraitDataStorage';
import { iBaseTraitDataStorage } from '../interfaces/data-storage-interfaces';
import { iLocalFileTraitDataStorageProps } from '../interfaces/props/trait-data-storage';
import saveCharacterSheetToFile from './utils/saveCharacterSheetToFile';

export default class LocalFileTraitDataStorage<
    N extends TraitNameUnionOrString,
    V extends TraitValueTypeUnion
  >
  extends AbstractTraitDataStorage<N, V>
  implements iBaseTraitDataStorage<N, V> {
  #characterSheet: iCharacterSheet;
  #resolvedFilePath: string;
  path: string;

  constructor(props: iLocalFileTraitDataStorageProps<N, V>) {
    super(props);
    const {
      characterSheet,
      resolvedBasePath,
      name,
      parentPath,
      dataStorageFactory,
    } = props;
    this.path = dataStorageFactory.createPath(parentPath, name);

    // ? is this required, needed to do some debugging before
    if (!characterSheet) throw Error(`characterSheet is not defined`);

    this.#characterSheet = characterSheet;
    this.#resolvedFilePath = path.resolve(
      resolvedBasePath,
      `${characterSheet.id}.json`
    );
  }

  cleanUp(): boolean {
    // do nothing
    return true;
  }

  protected async afterValueChange(): Promise<void> {
    // auto save character sheet to file
    saveCharacterSheetToFile(
      this.#characterSheet.data(),
      this.#resolvedFilePath
    );
  }
}

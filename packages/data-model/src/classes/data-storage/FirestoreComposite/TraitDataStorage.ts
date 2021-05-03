import { Firestore, SubDocument } from '@quirk-a-bot/common';

import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import { iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import AbstractTraitDataStorage from '../AbstractTraitDataStorage';
import { iBaseTraitDataStorage } from '../interfaces/data-storage-interfaces';
import { iFirestoreCompositeTraitDataStorageProps } from '../interfaces/props/trait-data-storage';

export default class FirestoreCompositeTraitDataStorage<
    N extends TraitNameUnionOrString,
    V extends TraitValueTypeUnion
  >
  extends AbstractTraitDataStorage<N, V>
  implements iBaseTraitDataStorage<N, V> {
  #subDocument: SubDocument<Record<N, iBaseTraitData<N, V>>, N>;
  path: string;

  constructor(props: iFirestoreCompositeTraitDataStorageProps<N, V>) {
    super(props);
    const { parentPath, defaultValueIfNotDefined, name, subDocument } = props;
    this.#subDocument = subDocument;
    this.path = this.createTraitPath(parentPath, name);

    // const timerName = `Time to initialise trait "${this.path}"`;

    // console.time(timerName);
    // make sure trait exists, then set listeners on it
    this.initAsync()
      /*
      .then(() => {
        // console.warn(`Successfully initialised trait with path ${this.path} and value ${this.private.value}`);
        return null;
      })
      .finally(
        () => console.timeEnd(timerName)
      )*/
      .catch(console.error);
  }

  cleanUp(): boolean {
    // this is handled in parent collection, no cleanup at this level
    return true;
  }

  /** Function to be called after the local value is changed, to signal that the data storage value should also be changed */
  protected afterValueChange(oldValue: V, newValue: V): void {
    this.handleChangeAsync(oldValue, newValue);
  }

  protected async assertTraitExistsOnDataStorageAsync(
    traitData: iBaseTraitData<N, V>
  ): Promise<void> {
    if (!this.#subDocument.data) await this.#subDocument.setValue(traitData);
  }

  /** Creates a trait path that satisfies firestore requirements */
  protected createTraitPath(parentPath: string, name: string): string {
    // const segments = parentPath.split("/");

    /*
    if (segments.length % 2) {
      // if parent is a collection (even path segments) then return as normal
      return createPath(parentPath, name);
    }
    // if parent is a document (odd path segments) then put this in a core collection, to satisfy firestore requirements
    return createPath(`${parentPath}/${CORE_TRAIT_COLLECTION_NAME}`, name);
    */

    // todo test if this is always accurate
    return `${parentPath}.${name}`;
  }

  private async handleChangeAsync(oldValue: V, newValue: V) {
    try {
      await this.#subDocument.setValue({ name: this.name, value: newValue });
    } catch (error) {
      console.error(__filename, { error });
    }
  }

  private async initAsync() {
    try {
      await this.assertTraitExistsOnDataStorageAsync({
        name: this.name,
        value: this.private.value,
      });
    } catch (error) {
      console.error(
        __filename,
        `Could not assert that trait with name ${this.name} exists in collection at path ${this.path}`,
        { error }
      );
    }
  }
}

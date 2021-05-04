import {
  AbstractCompositeDocument, arrayToRecord, CompositeDocumentChangeData,
  ConsistentCompositeDocument, SubDocumentCreateDetails, SubDocumentDeleteDetails,
  TRAIT_COMPOSITE_DOCUMENT_COLLECTION_NAME,
} from '@quirk-a-bot/common';

import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import { iBaseTrait, iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import AbstractTraitCollectionDataStorage from '../AbstractTraitCollectionDataStorage';
import { iBaseTraitDataStorage } from '../interfaces/data-storage-interfaces';
import {
  iFirestoreCompositeTraitCollectionDataStorageProps,
} from '../interfaces/props/trait-collection-data-storage';
import { iBaseTraitDataStorageProps } from '../interfaces/props/trait-data-storage';
import { createPath } from '../utils/createPath';
import FirestoreCompositeTraitDataStorage from './TraitDataStorage';

export default class FirestoreCompositeTraitCollectionDataStorage<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion,
  D extends iBaseTraitData<N, V>,
  T extends iBaseTrait<N, V, D>
> extends AbstractTraitCollectionDataStorage<N, V, D, T> {
  #compositeDocument: AbstractCompositeDocument<Record<N, D>>;
  /** Path to the composite document */
  path: string;

  constructor(
    props: iFirestoreCompositeTraitCollectionDataStorageProps<N, V, D, T>
  ) {
    super({
      ...props,
    });
    const {
      firestore,
      parentPath,
      name,
      onAdd,
      onDelete,
      initialData,
      dataPredicate,
      namePredicate,
    } = props;
    // this.#firestore = firestore;

    this.initMap(initialData);

    const pathToCompositeDocumentCollection = createPath(
      parentPath,
      TRAIT_COMPOSITE_DOCUMENT_COLLECTION_NAME
    );

    // path to the composite document
    const path = createPath(pathToCompositeDocumentCollection, name);
    this.path = path;

    const handleChange: (
      changeData: CompositeDocumentChangeData<Record<N, D>>
    ) => void = ({ changes }) => {
      const { creates, deletes } = changes;

      const property: keyof D = "value";

      // handle creations
      if (creates)
        Object.entries<SubDocumentCreateDetails<Record<N, D>>[N]>(
          creates
        ).forEach(([_key, { value }]) => {
          if (onAdd) onAdd({ newValue: value, property: property as string });
        });

      // handle deletions
      if (deletes)
        Object.entries<SubDocumentDeleteDetails<Record<N, D>>[N]>(
          deletes
        ).forEach(([_key, { value }]) => {
          if (onDelete)
            onDelete({ oldValue: value, property: property as string });
        });
    };

    const initialDataRecord: Record<N, D> = initialData
      ? arrayToRecord({
          array: initialData,
          propertyNameReducer: (element) => element.name,
        })
      : ({} as Record<N, D>);

    this.#compositeDocument = ConsistentCompositeDocument.load({
      firestore,
      handleChange,
      keyPredicate: namePredicate,
      path,
      valuePredicate: dataPredicate,
      initialData: initialDataRecord,
    });
  }

  protected afterAddInternal(_name: N): void {
    // do nothing, traits are added in trait instance creator
  }

  protected afterTraitCleanUp(): boolean {
    try {
      this.#compositeDocument.cleanUp();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  protected async deleteTraitFromDataStorage(name: N): Promise<void> {
    try {
      await this.#compositeDocument.delete(name);
    } catch (error) {
      return console.error(
        __filename,
        `error deleting trait ${name} from data storage`,
        error
      );
    }
  }

  protected newTraitDataStorage: (
    props: iBaseTraitDataStorageProps<N, V>
  ) => iBaseTraitDataStorage<N, V> = (props) =>
    new FirestoreCompositeTraitDataStorage<N, V>({
      ...props,
      subDocument: this.#compositeDocument.get(props.name),
    });
}

import {
  CompositeDocumentChangeData, SubDocumentCreateDetails, SubDocumentDeleteDetails,
} from 'packages/common/src/classes/AbstractCompositeDocument';

import {
  AbstractCompositeDocument, arrayToRecord, ConsistentCompositeDocument, Firestore,
} from '@quirk-a-bot/common';

import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import isTraitData from '../../../utils/type-predicates/isTraitData';
import { iBaseTrait, iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import AbstractTraitCollectionDataStorage from '../AbstractTraitCollectionDataStorage';
import {
  iFirestoreCompositeTraitCollectionDataStorageProps, iFirestoreTraitCollectionDataStorageProps,
} from '../interfaces/props/trait-collection-data-storage';
import { createPath } from '../utils/createPath';

export default class FirestoreCompositeTraitCollectionDataStorage<
  N extends TraitNameUnionOrString,
  V extends TraitValueTypeUnion,
  D extends iBaseTraitData<N, V>,
  T extends iBaseTrait<N, V, D>
> extends AbstractTraitCollectionDataStorage<N, V, D, T> {
  #compositeDocument: AbstractCompositeDocument<Record<N, D>>;
  #firestore: Firestore;

  constructor(
    props: iFirestoreCompositeTraitCollectionDataStorageProps<N, V, D, T>
  ) {
    super({ ...props, instanceCreator: ({}) => {} });
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
    this.#firestore = firestore;

    const path = createPath(parentPath, name);

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

  protected afterAddInternal(name: N): void {
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
}

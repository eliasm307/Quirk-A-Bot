import {
  AbstractCompositeDocument, arrayToRecord, CompositeDocumentChangeData,
  ConsistentCompositeDocument, SubDocumentCreateDetails, SubDocumentDeleteDetails,
  SubDocumentUpdateDetails, TRAIT_COMPOSITE_DOCUMENT_COLLECTION_NAME,
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
      // onAdd,
      // onDelete,
      initialData,
      dataPredicate,
      namePredicate,
    } = props;
    // this.#firestore = firestore;

    const pathToCompositeDocumentCollection = createPath(
      parentPath,
      TRAIT_COMPOSITE_DOCUMENT_COLLECTION_NAME
    );

    // path to the composite document
    const path = createPath(pathToCompositeDocumentCollection, name);
    this.path = path;

    const handleChange: (
      changeData: CompositeDocumentChangeData<Record<N, D>>
    ) => Promise<void> = async ({ changes }) => {
      const { creates, deletes, updates } = changes;

      // const property: keyof D = "value";

      // ? should these change handlers log changes?

      // handle updates
      if (updates) {
        const changePromises = Object.entries<
          SubDocumentUpdateDetails<Record<N, D>>[N]
        >(updates).map(([key, { after, before }]) => {
          console.warn(`Update handler`, { key, before, after });

          const traitName = key as N;

          // internal handler
          /*
          this.map.set(
            key as N,
            this.createTraitInstance(key as N, after.value)
          );
          */
          return this.set(traitName, after.value);

          // external handler
          // ? should there be a separate change handler or should they all be the same handler?
        });
        await Promise.all(changePromises);
      }

      // handle creations
      if (creates) {
        const changePromises = Object.entries<
          SubDocumentCreateDetails<Record<N, D>>[N]
        >(creates).map(([key, { value }]) => {
          console.warn(`Create handler`, { key, value });

          const traitName = key as N;

          // internal handler
          // this.map.set(key as N, this.createTraitInstance(key as N, value));
          return this.set(traitName, value);

          // external handler // ! this is called in this.set also
          // if (onAdd) onAdd({ newValue: value, property: property as string });
        });
        await Promise.all(changePromises);
      }

      // handle deletions
      if (deletes) {
        const changePromises = Object.entries<
          SubDocumentDeleteDetails<Record<N, D>>[N]
        >(deletes).map(async ([key, { value }]) => {
          console.warn(`Delete handler`, { key, value });

          const traitName = key as N;

          // internal handler
          // this.map.delete(key as N);
          return this.delete(traitName);

          // external handler // ! this is called in this.set also
          // if (onDelete) onDelete({ oldValue: value, property: property as string });
        });
        await Promise.all(changePromises);
      }
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

    this.setInitialData(initialData);
  }

  protected async addTraitToDataStorage(name: N, value: V) {
    await this.#compositeDocument.set(name, { name, value } as D);
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

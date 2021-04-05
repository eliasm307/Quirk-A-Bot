import { iSubDocument } from 'src/declarations/interfaces';

import { Firestore } from '@quirk-a-bot/firebase-utils';

export interface SubDocumentProps<K extends string, V> {
  data: V;
  firestore: Firestore;
  firestoreDataUpdater: (newData: V) => Promise<void>;
  key: K;
  onChangeCallback?: OnChangeCallback<V>;
  parentDocumentPath: string;
}

type OnChangeCallback<V> = (handleChange: (newData: V) => void) => void;

/** Provides an interface for viewing and mutating sub documents */
export default class SubDocument<K extends string, V>
  implements iSubDocument<V> {
  #private: Omit<SubDocumentProps<K, V>, "parentDocumentPath">;
  parentDocumentPath: string;

  constructor(props: SubDocumentProps<K, V>) {
    const { parentDocumentPath, ...privateProps } = props;

    this.#private = {
      ...privateProps,
    };

    this.parentDocumentPath = parentDocumentPath;
  }

  get data() {
    return this.#private.data;
  }

  delete(): void {
    throw new Error("Method not implemented.");
  }

  async setData(newValue: V) {
    // save data locally
    this.#private.data = newValue;

    // apply change to firestore
    await this.#private.firestoreDataUpdater(newValue);
  }

  /** Sets data locally without applying the change to firestore */
  setLocalData(newValue: V): void {
    throw new Error("Method not implemented.");
  }
}

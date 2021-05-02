import { iSubDocument } from '../declarations/interfaces';
import { Firestore } from '../FirebaseExports';

export interface SubDocumentProps<K extends string | number | symbol, V> {
  data: V;
  deleteFromDataStorage: () => Promise<void>;
  firestore: Firestore;
  key: K;
  onChangeCallback?: (newData: V) => void;
  parentDocumentPath: string;
  updateOnDataStorage: (newData: V) => Promise<void>;
}

/** Provides an interface for viewing and mutating sub documents */
export default class SubDocument<K extends string | number | symbol, V>
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
    this.#private.deleteFromDataStorage();
  }

  async setData(newValue: V) {
    // save data locally
    this.#private.data = newValue;

    // apply change to firestore
    await this.#private.updateOnDataStorage(newValue);

    if (this.#private.onChangeCallback)
      this.#private.onChangeCallback(newValue);
  }

  /** Sets data locally without applying the change to firestore */
  setDataLocallyOnly(newValue: V): void {
    // save data locally
    this.#private.data = newValue;

    if (this.#private.onChangeCallback)
      this.#private.onChangeCallback(newValue);
  }
}

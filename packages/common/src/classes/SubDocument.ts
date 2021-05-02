import { iSubDocument } from '../declarations/interfaces';
import { Firestore } from '../FirebaseExports';

export interface SubDocumentProps<K extends string | number | symbol, V> {
  deleteFromDataStorage: () => Promise<any>;
  firestore: Firestore;
  getDataFromStorage: () => V | undefined;
  key: K;
  onChangeCallback?: (newData: V) => void;
  parentDocumentPath: string;
  setOnDataStorage: (newData: V) => Promise<any>;
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
    return this.#private.getDataFromStorage();
  }

  async delete(): Promise<iSubDocument<V>> {
    await this.#private.deleteFromDataStorage();
    return this;
  }

  /** Sets data locally without applying the change to firestore */
  setDataLocallyOnly(newValue: V): void {
    // ? is this actually required?
    // save data locally
    // this.#private.data = newValue;

    if (this.#private.onChangeCallback)
      this.#private.onChangeCallback(newValue);
  }

  async setValue(newValue: V): Promise<iSubDocument<V>> {
    // save data locally
    // this.#private.data = newValue;

    // apply change to firestore
    await this.#private.setOnDataStorage(newValue);

    this.setDataLocallyOnly(newValue);

    return this;
  }
}

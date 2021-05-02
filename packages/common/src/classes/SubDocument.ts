import { iSubDocument } from '../declarations/interfaces';
import { Firestore } from '../FirebaseExports';

export interface SubDocumentProps<
  S extends Record<string, any>,
  K extends keyof S
> {
  deleteFromDataStorage: () => Promise<any>;
  firestore: Firestore;
  getDataFromStorage: () => S[K] | undefined;
  key: K;
  onChangeCallback?: (newData: S[K]) => void;
  parentDocumentPath: string;
  setOnDataStorage: (newData: S[K]) => Promise<any>;
}

/** Provides an interface for viewing and mutating sub documents */
export default class SubDocument<
  S extends Record<string, any>,
  K extends keyof S
> implements iSubDocument<S, K> {
  #private: Omit<SubDocumentProps<S, K>, "parentDocumentPath">;
  parentDocumentPath: string;

  constructor(props: SubDocumentProps<S, K>) {
    const { parentDocumentPath, ...privateProps } = props;

    this.#private = {
      ...privateProps,
    };

    this.parentDocumentPath = parentDocumentPath;
  }

  get data() {
    return this.#private.getDataFromStorage();
  }

  async delete(): Promise<iSubDocument<S, K>> {
    await this.#private.deleteFromDataStorage();
    return this;
  }

  /** Sets data locally without applying the change to firestore */
  setDataLocallyOnly(newValue: S[K]): void {
    // ? is this actually required?
    // save data locally
    // this.#private.data = newValue;

    if (this.#private.onChangeCallback)
      this.#private.onChangeCallback(newValue);
  }

  async setValue(newValue: S[K]): Promise<iSubDocument<S, K>> {
    // save data locally
    // this.#private.data = newValue;

    // apply change to firestore
    await this.#private.setOnDataStorage(newValue);

    this.setDataLocallyOnly(newValue);

    return this;
  }
}

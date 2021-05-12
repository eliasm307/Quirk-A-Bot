import { iSubDocument } from '../declarations/interfaces';
import { Firestore } from '../FirebaseExports';

export interface SubDocumentProps<
  S extends Record<string, unknown>,
  K extends keyof S
> {
  deleteFromDataStorage: () => Promise<unknown>;
  firestore: Firestore;
  getDataFromStorage: () => S[K] | undefined;
  key: K;
  parentDocumentPath: string;
  setOnDataStorage: (newData: S[K]) => Promise<unknown>;
}

/** Provides an interface for viewing and mutating sub documents
 * @generic `S` - this represents the overall schema of the composite document
 * @generic `K` - this is the specific key of the composite that the sub document relates to, allows the type system to be more accurate if the schema is inconsistent
 */
export default class SubDocument<
  S extends Record<string, unknown>,
  K extends keyof S = keyof S
> implements iSubDocument<S, K> {
  #private: Omit<SubDocumentProps<S, K>, "parentDocumentPath"> & {
    onChangeCallback?: (newData: S[K]) => void;
  };
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

  /** Sets the callback to use when there is a change */
  onChangeCallback(callback: (newData: S[K]) => void) {
    this.#private.onChangeCallback = callback;
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

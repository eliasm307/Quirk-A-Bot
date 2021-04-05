import { iSubDocument } from 'src/declarations/interfaces';

import { Firestore } from '@quirk-a-bot/firebase-utils';

interface Props<K extends string, V> {
  firestore: Firestore;
  initialData: V;
  key: K;
  onChangeCallback?: OnChangeCallback<V>;
  parentDocumentPath: string;
}

type OnChangeCallback<V> = (handleChange: (newData: V) => void) => void;

export default class SubDocument<K extends string, V>
  implements iSubDocument<V> {
  #private: {
    data: V;
    firestore: Firestore;
    key: K;
    onChangeCallback?: OnChangeCallback<V>;
  };
  parentDocumentPath: string;

  constructor(props: Props<K, V>) {
    const {
      initialData,
      firestore,
      key,
      parentDocumentPath,
      onChangeCallback,
    } = props;

    this.#private = {
      data: initialData,
      firestore: firestore,
      key: key,
      onChangeCallback: onChangeCallback,
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
    // todo set data on firestore
    this.#private.data = newValue;

    try {
      await this.#private.firestore
        .doc(this.parentDocumentPath)
        .set({ [this.#private.key]: newValue }, { merge: true });
    } catch (error) {
      console.error(__filename, `Error setting data to sub-document`, {
        key: this.#private.key,
        parentDocumentPath: this.parentDocumentPath,
      });
    }
  }

  setDataSilently(newValue: V): void {
    throw new Error("Method not implemented.");
  }
}

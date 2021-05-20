import {
  ChangeHandler, CHARACTER_COLLECTION_NAME, DEFAULT_CHARACTER_IMAGE_URL, DEFAULT_CHARACTER_NAME,
  Firestore, FirestoreCollectionReference, InconsistentCompositeDocument, isString,
} from '@quirk-a-bot/common';

import returnValueWhenLoaded from '../../../utils/returnValueWhenLoaded';
import isCharacterData from '../../../utils/type-predicates/isCharacterData';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { iCharacterData } from '../../game/interfaces/game-player-interfaces';
import defaultGameData from '../../game/utils/defaultGameData';
import assertDocumentExistsOnFirestore from '../Firestore/utils/assertDocumentExistsOnFirestore';
import { iDataStorageFactory, iGameDataStorage } from '../interfaces/data-storage-interfaces';
import { iFirestoreCompositeGameDataStorageProps } from '../interfaces/props/game-data-storage';
import readGameDataFromFirestoreComposite from './utils/readGameData';
import writeGameDataToFirestoreComposite from './utils/writeGameData';

export default class FirestoreCompositeGameDataStorage
  implements iGameDataStorage
{
  // protected characterSheets?: Map<string, iCharacterSheet>;
  protected dataStorageFactory: iDataStorageFactory;
  protected firestore: Firestore;
  protected id: string;

  #characterCollectionRef: FirestoreCollectionReference;
  // this will be loaded when listener returns first results
  #characterData?: iCharacterData[];
  #compositeDocument: InconsistentCompositeDocument<iGameData>;
  #data?: iGameData;
  #externalChangeHandler?: ChangeHandler<iGameData>;
  #unsubscribeCharacterCollection: () => void;
  // characterData: Map<string, iCharacterData>;
  path: string;

  private constructor(
    props: iFirestoreCompositeGameDataStorageProps & { initialData: iGameData }
  ) {
    const { id, dataStorageFactory, firestore, parentPath, initialData } =
      props;
    this.id = id;
    this.path = dataStorageFactory.createPath(parentPath, id);
    this.#data = initialData;
    this.dataStorageFactory = dataStorageFactory;
    this.firestore = firestore;
    const characterCollectionPath = dataStorageFactory.createPath(
      this.path,
      CHARACTER_COLLECTION_NAME
    );
    this.#characterCollectionRef = firestore.collection(
      characterCollectionPath
    );

    // listen to character collection
    this.#unsubscribeCharacterCollection =
      this.#characterCollectionRef.onSnapshot({
        next: (collectionSnapshot) => {
          const data = collectionSnapshot.docs.map((documentSnapshot) =>
            documentSnapshot.data()
          );

          this.#characterData = data.filter(isCharacterData);
        },
        error: console.error,
      });

    // load and listen to game document
    this.#compositeDocument = InconsistentCompositeDocument.load<iGameData>({
      firestore,
      handleChange: ({ newData }) => {
        this.#data = newData && { ...newData };
        if (this.#externalChangeHandler) this.#externalChangeHandler(newData);
      },
      path: this.path,
      valuePredicates: {
        description: isString,
        discordBotWebSocketServer: (value): value is string | undefined =>
          typeof value === "undefined" || isString(value),
        gameMasters: Array.isArray,
        id: isString,
      },
    });
  }

  static async load(
    props: iFirestoreCompositeGameDataStorageProps
  ): Promise<FirestoreCompositeGameDataStorage> {
    const { firestore, dataStorageFactory, id, parentPath } = props;

    const initialData = await assertDocumentExistsOnFirestore<iGameData>({
      firestore,
      path: dataStorageFactory.createPath(parentPath, id),
      newDefaultData: () => defaultGameData(id),
      documentDataReader: readGameDataFromFirestoreComposite,
      documentDataWriter: writeGameDataToFirestoreComposite,
    });

    return new FirestoreCompositeGameDataStorage({ ...props, initialData });
  }

  async addCharacter(id: string): Promise<void> {
    const charactersData = await this.getCharacterData();

    if (charactersData.some((character) => character.id === id))
      return console.warn(
        "Cannot add character to game as they are already in the game"
      );

    // todo extract to util
    const newCharacterData: iCharacterData = {
      id,
      img: DEFAULT_CHARACTER_IMAGE_URL,
      name: DEFAULT_CHARACTER_NAME,
    };

    // add to local data
    this.#characterData = this.#characterData
      ? [...this.#characterData, newCharacterData]
      : [newCharacterData];

    // update on data storage
    await this.#characterCollectionRef.doc(id).set(newCharacterData);
  }

  cleanUp(): boolean {
    try {
      this.#unsubscribeCharacterCollection();
      this.#compositeDocument.cleanUp();
      return true;
    } catch (error) {
      console.error(`Error cleaning up game "${this.path}"`, error);
      return false;
    }
  }

  async data(): Promise<iGameData> {
    return returnValueWhenLoaded(() => this.#data, "game data");
  }

  async getCharacterData(): Promise<iCharacterData[]> {
    return returnValueWhenLoaded(() => this.#characterData, "characters data");
  }

  onChange(handler: ChangeHandler<iGameData>): void {
    this.#externalChangeHandler = handler;
  }

  async setDescription(description: string): Promise<void> {
    await this.#compositeDocument.set("description", description);
  }

  async update(updates: Partial<Omit<iGameData, "id">>): Promise<void> {
    await this.#compositeDocument.update(updates);
  }
}

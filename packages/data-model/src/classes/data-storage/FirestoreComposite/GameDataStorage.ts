import {
  ChangeHandler, CHARACTER_COLLECTION_NAME, DEFAULT_CHARACTER_IMAGE_URL, DEFAULT_CHARACTER_NAME,
  Firestore, FirestoreCollectionReference, InconsistentCompositeDocument, isOptionalString,
  isString, newIsArrayPredicate,
} from '@quirk-a-bot/common';

import returnValueWhenLoaded from '../../../utils/returnValueWhenLoaded';
import isCharacterData from '../../../utils/type-predicates/isCharacterData';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { iCharacterData } from '../../game/interfaces/game-player-interfaces';
import defaultCharacterData from '../../game/utils/defaultCharacterData';
import defaultGameData from '../../game/utils/defaultGameData';
import assertDocumentExistsOnFirestore from '../Firestore/utils/assertDocumentExistsOnFirestore';
import { iDataStorageFactory, iGameDataStorage } from '../interfaces/data-storage-interfaces';
import { iFirestoreCompositeGameDataStorageProps } from '../interfaces/props/game-data-storage';
import readGameDataFromFirestoreComposite from './utils/readGameData';
import writeGameDataToFirestoreComposite from './utils/writeGameData';

export default class FirestoreCompositeGameDataStorage
  implements iGameDataStorage
{
  protected characterChangeHandler?: ChangeHandler<iCharacterData[]>;
  // protected characterSheets?: Map<string, iCharacterSheet>;
  protected dataStorageFactory: iDataStorageFactory;
  protected firestore: Firestore;

  #characterCollectionRef: FirestoreCollectionReference;
  // this will be loaded when listener returns first results
  #characterData?: iCharacterData[];
  #compositeDocument: InconsistentCompositeDocument<iGameData>;
  #data?: iGameData;
  #externalChangeHandler?: ChangeHandler<iGameData>;
  #unsubscribeCharacterCollection: () => void;
  id: string;
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
        next: async (collectionSnapshot) => {
          const data = collectionSnapshot.docs
            .map((documentSnapshot) => documentSnapshot.data())
            .filter(isCharacterData);

          const updatePromises: Promise<void>[] = [];

          collectionSnapshot
            .docChanges({ includeMetadataChanges: false })
            .forEach((docChange) => {
              const changedDocData = docChange.doc.data();
              const changedDocId = changedDocData.id || docChange.doc.id;

              // synchronise character id changes with game document
              switch (docChange.type) {
                case "added":
                  // local update
                  if (this.#data) {
                    // if changed document id has already been added, skip
                    if (
                      this.#data.characterIds.some(
                        (characterId) => characterId === changedDocId
                      )
                    )
                      break;

                    this.#data = {
                      ...this.#data,
                      characterIds: [...this.#data.characterIds, changedDocId],
                    };
                  } else {
                    // ? is this required?
                    this.#data = {
                      ...defaultGameData(changedDocId),
                      characterIds: [changedDocId],
                    };
                  }

                  // firestore update promise
                  updatePromises.push(
                    this.#compositeDocument.update(this.#data)
                  );
                  break;

                case "removed":
                  // local update
                  if (this.#data) {
                    this.#data = {
                      ...this.#data,
                      characterIds: this.#data.characterIds.filter(
                        (characterId) => characterId !== changedDocId
                      ),
                    };
                  } else {
                    // ? is this required?

                    this.#data = {
                      ...defaultGameData(changedDocId),
                    };
                  }

                  // firestore update promise
                  updatePromises.push(
                    this.#compositeDocument.update(this.#data)
                  );
                  break;

                case "modified":
                  // handled separately
                  break;

                default:
              }
            });

          // local update
          this.#characterData = [...data];

          // external change handler
          this.handleCharactersChangeCustom([...data]);

          // firestore update(s)
          await Promise.allSettled(updatePromises);
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
        discordBotWebSocketServer: isOptionalString,
        gameMasters: newIsArrayPredicate(isString),
        characterIds: newIsArrayPredicate(isString),
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
    const characterIds = charactersData.map((character) => character.id);

    const { characterIds: syncedCharacterIds } = await this.data();

    this.assertCharacterIdsSynchronised(characterIds, syncedCharacterIds);

    // check if character is already in game
    if (characterIds.some((characterId) => characterId === id))
      return console.warn(
        `Cannot add character with id ${id} to game as they are already in the game`
      );

    const newCharacterData: iCharacterData = defaultCharacterData(id);

    // add to local data
    this.#characterData = this.#characterData
      ? [...this.#characterData, newCharacterData]
      : [newCharacterData];

    if (this.#data)
      this.#data = { ...this.#data, characterIds: [...characterIds, id] };

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

  /** Sets a character change handler */
  onCharactersChange(handler: ChangeHandler<iCharacterData[]>): void {
    this.characterChangeHandler = handler;
  }

  async removeCharacter(id: string): Promise<void> {
    const charactersData = await this.getCharacterData();
    const characterIds = charactersData.map((character) => character.id);

    const { characterIds: syncedCharacterIds } = await this.data();

    this.assertCharacterIdsSynchronised(characterIds, syncedCharacterIds);

    // remove locally
    if (this.#characterData) {
      this.#characterData = this.#characterData.filter(
        (data) => data.id !== id
      );
    }
    // remove on firestore
    await this.#characterCollectionRef.doc(id).delete();
  }

  async setDescription(description: string): Promise<void> {
    await this.#compositeDocument.set("description", description);
  }

  async update(updates: Partial<Omit<iGameData, "id">>): Promise<void> {
    await this.#compositeDocument.update(updates);
  }

  /** Makes sure the actual character ids and synced character ids are the same */
  private assertCharacterIdsSynchronised(
    characterIds: string[],
    syncedCharacterIds: string[]
  ) {
    const characterIdsSet = new Set(characterIds);
    const syncedCharacterIdsSet = new Set(syncedCharacterIds);

    // ensure no duplicates
    if (
      characterIds.length !== characterIdsSet.size ||
      syncedCharacterIds.length !== syncedCharacterIdsSet.size
    ) {
      const error = `There are duplicate ids in synced or actual character ids`;
      console.error(error, { characterIds, syncedCharacterIds });
      throw Error();
    }

    // check length
    if (syncedCharacterIds.length !== characterIds.length)
      throw Error(
        `The synced character ids are out of date, ie ${syncedCharacterIds.length} synced ids and ${characterIds.length} actual character ids`
      );

    // check each key between synced and actual ids
    syncedCharacterIdsSet.forEach((syncedCharacterId) => {
      if (!characterIdsSet.has(syncedCharacterId))
        throw Error(
          `Synced CharacterId ${syncedCharacterId} is missing from actual character ids`
        );
    });
  }

  private handleCharactersChangeCustom(newData: iCharacterData[]) {
    if (this.characterChangeHandler) this.characterChangeHandler(newData);
  }
}

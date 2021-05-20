import { ChangeHandler, Firestore } from '@quirk-a-bot/common';

import { iHasInitialData } from '../../../declarations/interfaces';
import returnValueWhenLoaded from '../../../utils/returnValueWhenLoaded';
import { iCharacterSheet } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { iCharacterData } from '../../game/interfaces/game-player-interfaces';
import { iDataStorageFactory, iGameDataStorage } from '../interfaces/data-storage-interfaces';
import { iFirestoreGameDataStorageProps } from '../interfaces/props/game-data-storage';
import assertDocumentExistsOnFirestore from './utils/assertDocumentExistsOnFirestore';
import readGameDataFromFirestore from './utils/readGameDataFromFirestore';
import writeGameDataToFirestore from './utils/writeGameDataToFirestore';

export default class FirestoreGameDataStorage implements iGameDataStorage {
  protected characterSheets?: Map<string, iCharacterSheet>;
  protected dataStorageFactory: iDataStorageFactory;
  protected firestore: Firestore;
  protected gameData?: iGameData;

  id: string;
  path: string;

  private constructor(
    props: iFirestoreGameDataStorageProps & Partial<iHasInitialData<iGameData>>
  ) {
    const { id, dataStorageFactory, firestore, parentPath, initialData } =
      props;
    this.id = id;
    this.path = dataStorageFactory.createPath(parentPath, id);
    this.gameData = initialData;
    this.dataStorageFactory = dataStorageFactory;
    this.firestore = firestore;
  }

  static async load(
    props: iFirestoreGameDataStorageProps
  ): Promise<FirestoreGameDataStorage> {
    const { id, dataStorageFactory, firestore, parentPath } = props;

    const initialData = await assertDocumentExistsOnFirestore<iGameData>({
      firestore,
      path: dataStorageFactory.createPath(parentPath, id),
      // todo extract this to a static method or util
      newDefaultData: () => ({
        id,
        characterSheetIds: [],
        description: "",
        players: [],
        gameMasters: [],
      }),
      documentDataReader: readGameDataFromFirestore,
      documentDataWriter: writeGameDataToFirestore,
    });

    return new FirestoreGameDataStorage({ ...props, initialData });
  }

  addCharacter(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  cleanUp(): boolean {
    throw new Error("Method not implemented.");
  }

  async data(): Promise<iGameData> {
    return returnValueWhenLoaded(() => this.gameData, "game data");
  }

  getCharacterData(): Promise<iCharacterData[]> {
    throw new Error("Method not implemented.");
  }

  onChange(handler: ChangeHandler<iGameData>): void {
    throw new Error("Method not implemented.");
  }

  update(updates: Partial<Omit<iGameData, "id" | "uid">>): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

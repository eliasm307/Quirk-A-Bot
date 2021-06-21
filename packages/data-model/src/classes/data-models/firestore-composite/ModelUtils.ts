import { GAMES_COLLECTION_NAME } from 'packages/common/src/constants';
import { firestore } from 'packages/common/src/FirebaseExports';

import { isGameData } from '../../../utils/type-predicates';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { ModelUtils } from '../interfaces';

export default class FirestoreCompositeModelUtils implements ModelUtils {
  async getGameData(id: string): Promise<iGameData | null> {
    const gameDocumentRef = firestore.collection(GAMES_COLLECTION_NAME).doc(id);

    const gameSnapshot = await gameDocumentRef.get();

    if (!gameSnapshot.exists) return null;

    const data = gameSnapshot.data();

    if (!isGameData(data)) {
      console.warn(`Game data for id ${id} doesn't match schema predicate`);
      return null;
    }

    return data;
  }
}

import { Observable } from 'rxjs';

import { CHARACTER_COLLECTION_NAME, firestore, iHasParentPath } from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import observableFromFirestoreCollection from '../../../utils/observables/observableFromFirestoreCollection';
import { isCharacterSheetData } from '../../../utils/type-predicates';
import isGameData from '../../../utils/type-predicates/isGameData';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { createPath } from '../../data-storage/utils/createPath';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { GameModelReader } from '../interfaces';
import AbstractDocumentReader from './AbstractDocumentReader';

interface Props extends iHasId, iHasParentPath {}

// todo test

export default class GameFirestoreCompositeModelReader
  extends AbstractDocumentReader<iGameData>
  implements GameModelReader
{
  characterCollectionData$: Observable<iCharacterSheetData[]>;

  constructor(props: Props) {
    super({ ...props, dataPredicate: isGameData });

    const characterCollectionPath = createPath(
      this.path,
      CHARACTER_COLLECTION_NAME
    );

    this.characterCollectionData$ = observableFromFirestoreCollection({
      firestoreCollectionRef: firestore.collection(characterCollectionPath),
      dataPredicate: isCharacterSheetData,
    });
  }
}

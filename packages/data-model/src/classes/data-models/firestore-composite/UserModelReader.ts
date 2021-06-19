import { Observable } from 'rxjs';

import { CHARACTER_COLLECTION_NAME, iHasParentPath } from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import getFirestoreCollectionChangeObservable from '../../../utils/getFirestoreCollectionChangeObservable';
import { isCharacterSheetData } from '../../../utils/type-predicates';
import isGameData from '../../../utils/type-predicates/isGameData';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { createPath } from '../../data-storage/utils/createPath';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { GameModelReader } from '../interfaces/interfaces';
import AbstractDocumentReader from './AbstractDocumentReader';

interface Props extends iHasId, iHasParentPath {}

// todo test

export default class GameFirestoreCompositeModelReader
  extends AbstractDocumentReader<iGameData>
  implements GameModelReader
{
  characterCollectionChange$: Observable<iCharacterSheetData[]>;

  constructor(props: Props) {
    super({ ...props, dataPredicate: isGameData });

    this.characterCollectionChange$ = getFirestoreCollectionChangeObservable({
      collectionPath: createPath(this.path, CHARACTER_COLLECTION_NAME),
      dataPredicate: isCharacterSheetData,
    });
  }
}

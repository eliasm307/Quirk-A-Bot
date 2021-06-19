import { Observable } from 'rxjs';

import { iHasParentPath } from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import isGameData from '../../../utils/type-predicates/isGameData';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { GameModelReader } from '../interfaces/interfaces';
import AbstractModelReader from './AbstractModelReader';

interface Props extends iHasId, iHasParentPath {}

export default class GameFirestoreCompositeModelReader
  extends AbstractModelReader<iGameData>
  implements GameModelReader
{
  characterChange$: Observable<iCharacterSheetData[] | undefined> | null;

  constructor(props: Props) {
    super({ ...props, dataPredicate: isGameData });
  }
}

import { iHasParentPath } from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import { isCharacterSheetData } from '../../../utils/type-predicates';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iCharacterSheetModelReader } from '../interfaces';
import AbstractDocumentReader from './AbstractDocumentReader';

interface Props extends iHasId, iHasParentPath {}

export default class CharacterSheetFirestoreCompositeModelReader
  extends AbstractDocumentReader<iCharacterSheetData>
  implements iCharacterSheetModelReader
{
  constructor(props: Props) {
    super({ ...props, dataPredicate: isCharacterSheetData });
  }
}

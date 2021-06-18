import { iHasParentPath } from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import { isCharacterSheetData } from '../../../utils/type-predicates';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import AbstractModelReader from '../general/AbstractModelReader';

interface Props extends iHasId, iHasParentPath {}

export default class CharacterSheetFirestoreCompositeModelReader extends AbstractModelReader<iCharacterSheetData> {
  constructor(props: Props) {
    super({ ...props, dataPredicate: isCharacterSheetData });
  }
}

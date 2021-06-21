import { iHasParentPath } from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iCharacterSheetModelWriter } from '../interfaces';
import AbstractDocumentWriter from './AbstractDocumentWriter';

interface Props extends iHasId, iHasParentPath {}

export default class CharacterSheetFirestoreCompositeModelWriter
  extends AbstractDocumentWriter<iCharacterSheetData>
  implements iCharacterSheetModelWriter {}

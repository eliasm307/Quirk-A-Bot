import { iHasId, iHasParentPath } from '@quirk-a-bot/common';

import { iCharacterSheetData } from '../../../declarations/interfaces';
import { iCharacterSheetModelWriter } from '../interfaces';
import AbstractDocumentWriter from './AbstractDocumentWriter';

interface Props extends iHasId, iHasParentPath {}

export default class CharacterSheetFirestoreCompositeModelWriter
  extends AbstractDocumentWriter<iCharacterSheetData>
  implements iCharacterSheetModelWriter {}

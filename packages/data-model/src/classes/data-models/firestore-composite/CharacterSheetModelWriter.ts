import { iHasParentPath } from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import AbstractModelWriter from '../general/AbstractModelWriter';

interface Props extends iHasId, iHasParentPath {}

export default class CharacterSheetFirestoreCompositeModelWriter extends AbstractModelWriter<iCharacterSheetData> {}

import { iHasParentPath } from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import { iGameData } from '../../game/interfaces/game-interfaces';
import AbstractModelWriter from './AbstractModelWriter';

interface Props extends iHasId, iHasParentPath {}

export default class GameFirestoreCompositeModelWriter extends AbstractModelWriter<iGameData> {}

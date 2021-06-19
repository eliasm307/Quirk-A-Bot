import { iHasId } from '../../../declarations/interfaces';
import GameModelWriter from '../../data-models/firestore-composite/GameModelWriter';
import { GameModelReader } from '../../data-models/interfaces/interfaces';

interface Props extends iHasId {
  modelReader?: GameModelReader;
  modelWriter?: GameModelWriter;
}

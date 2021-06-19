import { UID } from '@quirk-a-bot/common';

import { GameModelReader } from '../../data-models/interfaces/interfaces';

export interface iGameViewModel extends GameModelReader {
  addCharacter(id: UID): Promise<void>;
  addGameMaster(id: UID): Promise<void>;
  removeCharacter(id: UID): Promise<void>;
  removeGameMaster(id: UID): Promise<void>;
  setDescription(description: string): void;
}

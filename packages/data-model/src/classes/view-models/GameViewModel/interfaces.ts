import { UID } from '@quirk-a-bot/common';

import { iGameModelReader } from '../../data-models/interfaces';

export interface iGameViewModel extends iGameModelReader {
  addCharacter(id: UID): Promise<void>;
  addGameAdmin(id: UID): Promise<void>;
  removeCharacter(id: UID): Promise<void>;
  removeGameAdmin(id: UID): Promise<void>;
  setDescription(description: string): void;
}

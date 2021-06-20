import { UID } from '@quirk-a-bot/common';

import { UserModelReader } from '../../data-models/interfaces';

interface CreateGameProps {
  description: string;
}

export interface iUserViewModel extends UserModelReader {
  createGame(props: CreateGameProps): Promise<void>;
}

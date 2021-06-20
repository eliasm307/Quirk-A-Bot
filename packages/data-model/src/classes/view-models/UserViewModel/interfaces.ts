import { WebURL } from '@quirk-a-bot/common';

import { iUserModelReader } from '../../data-models/interfaces';

interface CreateGameProps {
  description: string;
}

export interface iUserViewModel extends iUserModelReader {
  createGame(props: CreateGameProps): Promise<void>;
  setDisplayName(name: string): void;
  setPhotoUrl(url: WebURL): void;
}

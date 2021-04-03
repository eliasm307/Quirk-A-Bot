import { iAdminGame, iGamePlayerData } from './declarations/interfaces';
import PlayerGame, { iPlayerGameProps } from './PlayerGame';

interface Props extends iPlayerGameProps {}

export default class AdminGame extends PlayerGame implements iAdminGame {
  players: iGamePlayerData[];

  constructor(props: Props) {
    super(props);

    throw Error("Not implemented");
  }

  acceptPlayerRequest(playerId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  rejectPlayerRequest(playerId: string, reason?: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  removePlayer(playerId: string, reason?: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

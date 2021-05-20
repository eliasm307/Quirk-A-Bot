import { iGameData } from '../interfaces/game-interfaces';

export default function defaultGameData(id: string): iGameData {
  return {
    id,
    description: "",
    gameMasters: [],
  };
}

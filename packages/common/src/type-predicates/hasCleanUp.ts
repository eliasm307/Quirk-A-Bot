import { iHasCleanUp } from '../declarations';

export default function hasCleanUp(o: unknown): o is iHasCleanUp {
  return typeof o === "object" && (o as iHasCleanUp).cleanUp !== undefined;
}

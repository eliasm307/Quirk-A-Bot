import { iHasCleanUp } from '../declarations';

export default function hasCleanUp(o: any): o is iHasCleanUp {
  return typeof o === "object" && (o as iHasCleanUp).cleanUp !== undefined;
}

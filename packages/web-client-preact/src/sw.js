// @ts-ignore
import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw/';

setupRouting();
setupPrecaching(getFiles());

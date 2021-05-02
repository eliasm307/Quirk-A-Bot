import { LogSourceTypeNameUnion } from '../../../declarations/types';
import { iHasLogEvents } from './log-interfaces';

/** Base shape of log report produced by loggers */
export interface iBaseLogReport extends iHasLogEvents {
	sourceName: string;
	sourceType: LogSourceTypeNameUnion;
}

/** Log report produced by trait loggers */
export interface iTraitLogReport extends iBaseLogReport {}

/** Log report produced by trait collection loggers */
export interface iTraitCollectionLogReport extends iBaseLogReport {
	traitLogReports: iTraitLogReport[];
}

/** Log report produced by character sheet loggers */
export interface iCharacterSheetLogReport extends iBaseLogReport {
	traitCollectionLogReports: iTraitCollectionLogReport[];
	traitLogReports: iTraitLogReport[];
}

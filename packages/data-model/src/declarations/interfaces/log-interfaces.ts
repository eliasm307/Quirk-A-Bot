import { iLogEvent } from './log-interfaces';
import { LogOperationUnion, LogSourceTypeNameUnion } from './../types';
import { iHasNewValue, iHasOldValue } from './general-interfaces';

// todo group these

export interface iBaseLogEventProps {
	description?: string;
	property: string;
}

export interface iAddLogEventProps<V> extends iBaseLogEventProps, iHasNewValue<V> {}
export interface iDeleteLogEventProps<V> extends iBaseLogEventProps, iHasOldValue<V> {}
export interface iUpdateLogEventProps<V> extends iBaseLogEventProps, iHasOldValue<V>, iHasNewValue<V> {}

export interface iLogEvent extends iBaseLogEventProps {
	id: string;
	operation: LogOperationUnion;
	describe(): string;
	timeStamp: bigint; // nanosecond timestamp
	date: Date;
}

// todo relocate
export interface iHasLogEvents {
	readonly logEvents: iLogEvent[];
}

export interface iBaseLogReport extends iHasLogEvents {
	sourceName: string;
	sourceType: LogSourceTypeNameUnion;
}

export interface iTraitLogReport extends iBaseLogReport {}
export interface iTraitCollectionLogReport extends iBaseLogReport {
	traitLogReports: iTraitLogReport[];
}
export interface iCharacterSheetLogReport extends iBaseLogReport {
	coreTraitLogReports: iTraitLogReport[];
	traitCollectionLogReports: iTraitCollectionLogReport[];
}

export interface iAddLogEvent<V> extends iLogEvent, iHasNewValue<V> {}

/*
export interface iBaseLogger {
	getLogEvents(): iLogEvent[];
}
*/

/** For objects that require internal logging */
/*
export interface iLoggerSingle extends iBaseLogger {
	getLogReport(): iLogReport;
}
export interface iLoggerCollection extends iBaseLogger {
	getLogReports(): iLogReport[];
}
*/

export interface iHasLogReporter<L extends iBaseLogReporter<iBaseLogReport>> {
	log: L;
}

// todo relocate
export interface iHasLogReport<L extends iBaseLogReport> {
	readonly report: L;
}

/** Provides a read-only interface to a logger ie a logger proxy, which is provided to clients */
export interface iBaseLogReporter<L extends iBaseLogReport> extends iHasLogEvents, iHasLogReport<L> {
	toString(): string;
}

// todo relocate
export interface iCanLog {
	log(event: iLogEvent): void;
}

/** Handles new logs and emitting logs internally */
export interface iBaseLogger<L extends iBaseLogReport> extends iCanLog, iHasLogEvents, iHasLogReport<L> {
	sourceType: LogSourceTypeNameUnion;
}

// LOGGERS
export interface iTraitLogCollection extends iBaseLogger<iTraitLogReport> {}
export interface iTraitCollectionLogCollection extends iBaseLogger<iTraitCollectionLogReport> {}
export interface iCharacterSheetLogCollection extends iBaseLogger<iCharacterSheetLogReport> {}

// LOG REPORTERS
export interface iTraitLogReporter extends iBaseLogReporter<iTraitLogReport> {}
export interface iTraitCollectionLogReporter extends iBaseLogReporter<iTraitCollectionLogReport> {}
export interface iCharacterSheetLogReporter extends iBaseLogReporter<iCharacterSheetLogReport> {}

// HAS LOG REPORTER
export interface iHasTraitLogReporter {
	log: iTraitLogReporter;
}
export interface iHasTraitCollectionLogReporter {
	log: iTraitCollectionLogReporter;
}
export interface iHasCharacterSheetLogReporter {
	log: iCharacterSheetLogReporter;
}

// ? should source name and type be part of the actual log details?
export interface iLoggerProps {
	sourceName: string;

	/** A function to emit logs to a parent logger */
	parentLogHandler: ((event: iLogEvent) => void) | null;
}

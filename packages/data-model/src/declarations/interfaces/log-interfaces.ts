import { LogOperationUnion, LogSourceType } from './../types';
import { iHasNewValue } from './general-interfaces';
export interface iBaseLogEventProps {
	description?: string;
	property: string;
}

export interface iLogEvent extends iBaseLogEventProps {
	id: string;
	operation: LogOperationUnion;
	describe(): string;
	time: Date;
}

export interface iLogReport {
	sourceName: string;
	sourceType: LogSourceType;
	logEvents: iLogEvent[];
}

export interface iAddLogEvent<T> extends iLogEvent, iHasNewValue<T> {}

export interface iBaseLogger {
	getLogEvents(): iLogEvent[];
}

/** For objects that require internal logging */
export interface iLoggerSingle extends iBaseLogger {
	getLogReport(): iLogReport;
}
export interface iLoggerCollection extends iBaseLogger {
	getLogReport(): iLogReport[];
}

export interface iLogReporter {
	generateLogReport(logger: iLoggerSingle): string;
}

export interface iLogCollection {
	log(event: iLogEvent): void;

	getReport(): iLogReport;
}

export interface iLogCollectionProps {
	sourceName: string;
	sourceType: LogSourceType;
}

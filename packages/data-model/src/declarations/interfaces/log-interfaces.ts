import { LogOperationUnion, LogSourceType } from './../types';
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

export interface iLogReport {
	sourceName: string;
	sourceType: LogSourceType;
	logEvents: iLogEvent[];
}

export interface iAddLogEvent<V> extends iLogEvent, iHasNewValue<V> {}

export interface iBaseLogger {
	getLogEvents(): iLogEvent[];
}

/** For objects that require internal logging */
export interface iLoggerSingle extends iBaseLogger {
	getLogReport(): iLogReport;
}
export interface iLoggerCollection extends iBaseLogger {
	getLogReports(): iLogReport[];
}

export interface iLogReporter {
	generateLogReport(logger: iLoggerSingle): string;
}

export interface iLogCollection {
	log(event: iLogEvent): void;

	getReport(): iLogReport;
	getLogEvents(): iLogEvent[];
}

export interface iLogCollectionProps {
	sourceName: string;
	sourceType: LogSourceType;
}

import { LogOperation } from './../types';
import { iNewValue } from './general-interfaces';
export interface iBaseLogEventProps {
	note?: string;
	property: string;
}

// todo this violates interface segregation, intial and new value arent universal
export interface iLogEvent extends iBaseLogEventProps {
	operation: LogOperation;
	describe(): string;
	time: Date;
}

export interface iAddLogEvent<T> extends iLogEvent, iNewValue<T> {}

/** For objects that require internal logging */
export interface iLogger {
	getLogData(): iLogEvent[];
}

export interface iLogReporter {
	generateLogReport(logger: iLogger): string;
}

export interface iLogCollection {
	log(event: iLogEvent): void;

	toJson(): iLogEvent[];
}

import { LogOperationUnion } from './../types';
import { iHasNewValue } from './general-interfaces';
export interface iBaseLogEventProps {
	note?: string;
	property: string;
}

// todo this violates interface segregation, intial and new value arent universal
export interface iLogEvent extends iBaseLogEventProps {
	operation: LogOperationUnion;
	describe(): string;
	time: Date;
}

export interface iAddLogEvent<T> extends iLogEvent, iHasNewValue<T> {}

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

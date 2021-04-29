// -------------------------------------------------------
// GENERAL

import { iCanDescribe } from '../../../declarations/interfaces';
import { LogOperationUnion, LogSourceTypeNameUnion } from '../../../declarations/types';
import {
  iBaseLogReport, iCharacterSheetLogReport, iTraitCollectionLogReport, iTraitLogReport
} from './logReportInterfaces';

// todo move to log interfaces
export interface iHasOldValue<V> {
  oldValue: V;
}

export interface iHasNewValue<V> {
  newValue: V;
}
export interface iHasLogReport<L extends iBaseLogReport> {
  readonly report: L;
}
export interface iHasLogEvents {
  readonly events: iLogEvent[];
}

export interface iCanLog {
  log(event: iLogEvent): void;
}
export interface iHasProperty {
  property: string;
}

export interface iCanCreateChildTraitLogger {
  /** Creates a trait logger that reports any logs to the parent and the parent keeps the logger even if the trait is deleted */
  createChildTraitLogger(props: iChildLoggerCreatorProps): iTraitLogger;
}

export interface iCanCreateChildTraitCollectionLogger {
  /** Creates a trait collection logger that reports any logs to the parent */
  createChildTraitCollectionLogger(props: iChildLoggerCreatorProps): iTraitCollectionLogger;
}

// -------------------------------------------------------
// PROPS

/** Props used by a parent to create a child logger */
export interface iChildLoggerCreatorProps {
  sourceName: string;
}

// LOG EVENT PROPS

export interface iAbstractLogEventProps extends iHasProperty {
  operation: LogOperationUnion;
}
export interface iAddLogEventProps<V> extends iHasProperty, iHasNewValue<V> {}
export interface iDeleteLogEventProps<V> extends iHasProperty, iHasOldValue<V> {}
export interface iUpdateLogEventProps<V> extends iHasProperty, iHasOldValue<V>, iHasNewValue<V> {}

// LOGGER PROPS

/** Base props to instantiate a logger  */
export interface iBaseLoggerProps {
  /** A function to emit logs to a parent logger, allows parent logs to be naturally sorted in order of creation time */
  parentLogHandler: ((event: iLogEvent) => void) | null;
  sourceName: string;
}

// -------------------------------------------------------
// LOG EVENTS

export interface iLogEvent extends iHasProperty {
  /** Date the log event occured */
  date: Date;
  description: string;
  id: string;
  operation: LogOperationUnion;
  /** Timestamp to the nanosecond */
  timeStamp: bigint;
}

// -------------------------------------------------------
// LOG REPORTS

export interface iAddLogEvent<V> extends iLogEvent, iHasNewValue<V> {}

// -------------------------------------------------------
// LOGGERS

// ? should source name and type be part of the actual log details?

/** Handles new logs and emitting logs internally */
export interface iBaseLogger<L extends iBaseLogReport> extends iCanLog, iHasLogEvents, iHasLogReport<L> {
  /** An instance of a log reporter for this logger */
  reporter: iBaseLogReporter<L>;
  sourceType: LogSourceTypeNameUnion;
}

// LOGGERS
export interface iTraitLogger extends iBaseLogger<iTraitLogReport> {}

export interface iTraitCollectionLogger extends iBaseLogger<iTraitCollectionLogReport>, iCanCreateChildTraitLogger {}

export interface iCharacterSheetLogger
	extends iBaseLogger<iCharacterSheetLogReport>,
		iCanCreateChildTraitLogger,
		iCanCreateChildTraitCollectionLogger {}

// -------------------------------------------------------
// LOG REPORTERS
export interface iBaseLogReporterProps<L extends iBaseLogReport> extends iCanDescribe {
  logger: iBaseLogger<L>;
}

/** Provides a read-only interface to a logger ie a logger proxy, which is provided to clients */
export interface iBaseLogReporter<L extends iBaseLogReport> extends iHasLogEvents, iHasLogReport<L>, iCanDescribe {}
export interface iTraitLogReporter extends iBaseLogReporter<iTraitLogReport> {}
export interface iTraitCollectionLogReporter extends iBaseLogReporter<iTraitCollectionLogReport> {}
export interface iCharacterSheetLogReporter extends iBaseLogReporter<iCharacterSheetLogReport> {}

// -------------------------------------------------------
// HAS LOG REPORTER
export interface iHasLogReporter<L extends iBaseLogReporter<iBaseLogReport>> {
  log: L;
}
export interface iHasTraitLogReporter extends iHasLogReporter<iTraitLogReporter> {}
export interface iHasTraitCollectionLogReporter extends iHasLogReporter<iTraitCollectionLogReporter> {}
export interface iHasCharacterSheetLogReporter extends iHasLogReporter<iCharacterSheetLogReporter> {}

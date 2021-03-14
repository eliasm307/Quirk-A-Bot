import {
  iBaseLogger, iBaseLogReporter, iBaseLogReporterProps, iLogEvent
} from './interfaces/log-interfaces';
import { iBaseLogReport } from './interfaces/logReportInterfaces';

export default class LogReporter<R extends iBaseLogReport> implements iBaseLogReporter<R> {
	protected logger: iBaseLogger<R>;

	describe: () => string;

	constructor({ logger, describe: toString }: iBaseLogReporterProps<R>) {
		this.logger = logger;
		this.describe = toString;
	}

	get events(): iLogEvent[] {
		return [...this.logger.events];
	}

	get report(): R {
		return this.logger.report;
	}
}

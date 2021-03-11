import {
	iBaseLogReport,
	iBaseLogReporter,
	iLogEvent,
	iBaseLogReporterProps,
	iBaseLogger,
} from './../../declarations/interfaces/log-interfaces';
export default class LogReporter<L extends iBaseLogReport> implements iBaseLogReporter<L> {
	#logger: iBaseLogger<L>;
	constructor({ logger, toString }: iBaseLogReporterProps<L>) {
		this.#logger = logger;
		this.toString = toString;
	}
	toString: () => string;
	get events(): iLogEvent[] {
		return [...this.#logger.events];
	}
	get report(): L {
		return this.#logger.report;
	}
}

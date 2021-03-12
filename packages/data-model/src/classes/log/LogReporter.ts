import {
  iBaseLogger, iBaseLogReport, iBaseLogReporter, iBaseLogReporterProps, iLogEvent
} from './interfaces/log-interfaces';

export default class LogReporter<L extends iBaseLogReport> implements iBaseLogReporter<L> {
  #logger: iBaseLogger<L>;
  describe: () => string;

  constructor({ logger, describe: toString }: iBaseLogReporterProps<L>) {
		this.#logger = logger;
		this.describe = toString;
	}

  get events(): iLogEvent[] {
		return [...this.#logger.events];
	}

  get report(): L {
		return this.#logger.report;
	}
}

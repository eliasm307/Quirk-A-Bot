import { LogSourceTypeNameUnion } from '../../../declarations/types';
import { iBaseLoggerProps, iBaseLogReporter, iTraitLogger } from '../interfaces/log-interfaces';
import { iTraitLogReport } from '../interfaces/logReportInterfaces';
import LogReporter from '../LogReporter';
import traitLoggerToString from '../utils/traitLoggerToString';
import AbstractLogger from './AbstractLogger';

export default class TraitLogger extends AbstractLogger<iTraitLogReport> implements iTraitLogger {
  readonly reporter: iBaseLogReporter<iTraitLogReport>;

  sourceType: LogSourceTypeNameUnion = 'Trait';

  constructor(props: iBaseLoggerProps) {
		super(props);
		const toString = () => traitLoggerToString(this);
		this.reporter = new LogReporter({ logger: this, describe: toString });
	}

  get report(): iTraitLogReport {
		return {
			events: [...this.events],
			sourceName: this.sourceName,
			sourceType: this.sourceType,
		};
	}
}

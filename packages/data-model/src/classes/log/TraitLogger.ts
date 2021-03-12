import { LogSourceTypeNameUnion } from '../../declarations/types';
import AbstractLogger from './AbstractLogger';
import {
  iBaseLoggerProps, iBaseLogReporter, iTraitLogger, iTraitLogReport
} from './interfaces/log-interfaces';
import LogReporter from './LogReporter';
import traitLoggerToString from './utils/traitLoggerToString';

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

 
import { LogSourceTypeNameUnion } from '../../declarations/types';
import traitLoggerToString from '../../utils/traitLoggerToString';
import AbstractLogger from './AbstractLogger';
import {
  iBaseLoggerProps, iBaseLogReporter, iTraitLogger, iTraitLogReport
} from './interfaces/log-interfaces';
import LogReporter from './LogReporter';

export default class TraitLogger extends AbstractLogger<iTraitLogReport> implements iTraitLogger {
	sourceType: LogSourceTypeNameUnion = 'Trait';

	readonly reporter: iBaseLogReporter<iTraitLogReport>;

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

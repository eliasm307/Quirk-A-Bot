import { LogSourceTypeNameUnion } from '../../declarations/types';
import traitLoggerToString from '../../utils/traitLoggerToString';
import {
	iTraitLogReport,
	iTraitLogger,
	iLogEvent,
	iBaseLogReporter,
	iBaseLoggerProps,
} from './../../declarations/interfaces/log-interfaces';
import AbstractLogger from './AbstractLogger';
import LogReporter from './LogReporter';

export default class TraitLogger extends AbstractLogger<iTraitLogReport> implements iTraitLogger {
	sourceType: LogSourceTypeNameUnion = 'Trait';

	readonly reporter: iBaseLogReporter<iTraitLogReport>;

	constructor(props: iBaseLoggerProps) {
		super(props);
		const toString = () => traitLoggerToString(this);
		this.reporter = new LogReporter({ logger: this, toString });
	}

	get report(): iTraitLogReport {
		return {
			events: [...this.events],
			sourceName: this.sourceName,
			sourceType: this.sourceType,
		};
	}
}

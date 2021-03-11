import { LogSourceTypeNameUnion } from '../../declarations/types';
import traitCollectionLoggerToString from '../../utils/traitCollectionLoggerToString';
import {
	iTraitCollectionLogReporter,
	iTraitCollectionLogReport,
	iTraitLogger,
	iTraitCollectionLogger,
	iChildLoggerCreatorProps,
	iTraitLogReport,
	iBaseLogReporter,
	iBaseLoggerProps,
} from './../../declarations/interfaces/log-interfaces';
import AbstractLogger from './AbstractLogger';
import LogReporter from './LogReporter';
import TraitLogger from './TraitLogger';
export default class TraitCollecitonLogger
	extends AbstractLogger<iTraitCollectionLogReport>
	implements iTraitCollectionLogger {
	readonly reporter: iBaseLogReporter<iTraitCollectionLogReport>;
	sourceType: LogSourceTypeNameUnion = 'Trait Collection';

	constructor(props: iBaseLoggerProps) {
		super(props);
		const toString = () => traitCollectionLoggerToString(this);
		this.reporter = new LogReporter({ logger: this, toString });
	}

	createChildTraitLogger(props: iChildLoggerCreatorProps): iTraitLogger {
		return new TraitLogger({ ...props, parentLogHandler: this.log });
	}

	protected childTraitLoggers = new Map<string, iTraitLogger>();

	protected getChildTraitReports(): iTraitLogReport[] {
		return Array.from(this.childTraitLoggers.values()).map(logger => logger.report);
	}
	get report(): iTraitCollectionLogReport {
		return {
			events: [...this.events],
			sourceName: this.sourceName,
			sourceType: this.sourceType,
			traitLogReports: this.getChildTraitReports(),
		};
	}
}

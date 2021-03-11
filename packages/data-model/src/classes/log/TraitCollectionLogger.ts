import { LogSourceTypeNameUnion } from '../../declarations/types';
import createChildTraitLogger from '../../utils/createChildTraitLogger';
import traitCollectionLoggerToString from '../../utils/traitCollectionLoggerToString';
import {
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

export default class TraitCollecitonLogger
	extends AbstractLogger<iTraitCollectionLogReport>
	implements iTraitCollectionLogger {
	readonly reporter: iBaseLogReporter<iTraitCollectionLogReport>;
	sourceType: LogSourceTypeNameUnion = 'Trait Collection';

	constructor(props: iBaseLoggerProps) {
		super(props);
		const toString = () => traitCollectionLoggerToString(this);
		this.reporter = new LogReporter({ logger: this, describe: toString });
	}

	createChildTraitLogger({ sourceName }: iChildLoggerCreatorProps): iTraitLogger {
		return createChildTraitLogger(sourceName, this.childTraitLoggers, this.log);
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

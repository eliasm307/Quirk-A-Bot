import { LogSourceTypeNameUnion } from '../../../declarations/types';
import {
  iBaseLoggerProps, iBaseLogReporter, iChildLoggerCreatorProps, iLogEvent, iTraitCollectionLogger,
  iTraitLogger
} from '../interfaces/log-interfaces';
import { iTraitCollectionLogReport, iTraitLogReport } from '../interfaces/logReportInterfaces';
import LogReporter from '../LogReporter';
import createChildTraitLogger from '../utils/createChildTraitLogger';
import traitCollectionLoggerToString from '../utils/traitCollectionLoggerToString';
import AbstractLogger from './AbstractLogger';

export default class TraitCollecitonLogger
	extends AbstractLogger<iTraitCollectionLogReport>
	implements iTraitCollectionLogger {
	protected childTraitLoggers = new Map<string, iTraitLogger>();

	readonly reporter: iBaseLogReporter<iTraitCollectionLogReport>;

	sourceType: LogSourceTypeNameUnion = 'Trait Collection';

	constructor(props: iBaseLoggerProps) {
		super(props);
		const toString = () => traitCollectionLoggerToString(this);
		this.reporter = new LogReporter({ logger: this, describe: toString });
	}

	get report(): iTraitCollectionLogReport {
		return {
			events: [...this.events],
			sourceName: this.sourceName,
			sourceType: this.sourceType,
			traitLogReports: this.getChildTraitReports(),
		};
	}

	createChildTraitLogger({ sourceName }: iChildLoggerCreatorProps): iTraitLogger {
		return createChildTraitLogger(sourceName, this.childTraitLoggers, (event: iLogEvent) => this.log(event));
	}

	protected getChildTraitReports(): iTraitLogReport[] {
		return Array.from(this.childTraitLoggers.values()).map(logger => logger.report);
	}
}
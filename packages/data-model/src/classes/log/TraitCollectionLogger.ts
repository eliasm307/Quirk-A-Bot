import { LogSourceTypeNameUnion } from '../../declarations/types';
import {
	iTraitCollectionLogReporter,
	iTraitCollectionLogReport,
	iTraitLogger,
	iTraitCollectionLogger,
	iChildLoggerCreatorProps,
	iTraitLogReport,
} from './../../declarations/interfaces/log-interfaces';
import AbstractLogger from './AbstractLogger';
import TraitLogger from './TraitLogger';
export default class TraitCollecitonLogger
	extends AbstractLogger<iTraitCollectionLogReport>
	implements iTraitCollectionLogger {
	createChildTraitLogger(props: iChildLoggerCreatorProps): iTraitLogger {
		return new TraitLogger({ ...props, parentLogHandler: this.log });
	}
	sourceType: LogSourceTypeNameUnion = 'Trait Collection';
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

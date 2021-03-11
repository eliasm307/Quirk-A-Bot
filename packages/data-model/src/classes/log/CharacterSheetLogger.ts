import {
  iBaseLoggerProps, iBaseLogReporter, iCharacterSheetLogger, iCharacterSheetLogReport,
  iChildLoggerCreatorProps, iTraitCollectionLogger, iTraitCollectionLogReport, iTraitLogger,
  iTraitLogReport
} from '../../declarations/interfaces/log-interfaces';
import { LogSourceTypeNameUnion } from '../../declarations/types';
import characterSheetLoggerToString from '../../utils/characterSheetLoggerToString';
import createChildTraitCollectionLogger from '../../utils/createChildTraitCollectionLogger';
import createChildTraitLogger from '../../utils/createChildTraitLogger';
import AbstractLogger from './AbstractLogger';
import LogReporter from './LogReporter';

export default class CharacterSheetLogger
	extends AbstractLogger<iCharacterSheetLogReport>
	implements iCharacterSheetLogger {
	readonly reporter: iBaseLogReporter<iCharacterSheetLogReport>;
	sourceType: LogSourceTypeNameUnion = 'Character Sheet';
	protected childTraitLoggers = new Map<string, iTraitLogger>();
	protected childTraitCollectionLoggers = new Map<string, iTraitCollectionLogger>();

	constructor(props: iBaseLoggerProps) {
		super(props);
		const toString = () => characterSheetLoggerToString(this);
		this.reporter = new LogReporter({ logger: this, describe: toString });
	}
	createChildTraitCollectionLogger({ sourceName }: iChildLoggerCreatorProps): iTraitCollectionLogger {
		return createChildTraitCollectionLogger(sourceName, this.childTraitCollectionLoggers, this.log);
	}
	createChildTraitLogger({ sourceName }: iChildLoggerCreatorProps): iTraitLogger {
		return createChildTraitLogger(sourceName, this.childTraitLoggers, this.log);
	}

	protected getChildTraitReports(): iTraitLogReport[] {
		return Array.from(this.childTraitLoggers.values()).map(logger => logger.report);
	}
	protected getChildTraitCollectionReports(): iTraitCollectionLogReport[] {
		return Array.from(this.childTraitCollectionLoggers.values()).map(logger => logger.report);
	}

	get report(): iCharacterSheetLogReport {
		return {
			sourceName: this.sourceName,
			sourceType: this.sourceType,
			events: [...this.events],
			coreTraitLogReports: this.getChildTraitReports(),
			traitCollectionLogReports: this.getChildTraitCollectionReports(),
		};
	}
}

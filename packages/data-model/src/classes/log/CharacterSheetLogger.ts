 
import { LogSourceTypeNameUnion } from '../../declarations/types';
import characterSheetLoggerToString from '../../utils/characterSheetLoggerToString';
import createChildTraitCollectionLogger from '../../utils/createChildTraitCollectionLogger';
import createChildTraitLogger from '../../utils/createChildTraitLogger';
import AbstractLogger from './AbstractLogger';
import {
  iBaseLoggerProps, iBaseLogReporter, iCharacterSheetLogger, iCharacterSheetLogReport,
  iChildLoggerCreatorProps, iLogEvent, iTraitCollectionLogger, iTraitCollectionLogReport,
  iTraitLogger, iTraitLogReport
} from './interfaces/log-interfaces';
import LogReporter from './LogReporter';

// todo test
export default class CharacterSheetLogger
	extends AbstractLogger<iCharacterSheetLogReport>
	implements iCharacterSheetLogger {
	protected childTraitCollectionLoggers = new Map<string, iTraitCollectionLogger>();
	protected childTraitLoggers = new Map<string, iTraitLogger>();

	readonly reporter: iBaseLogReporter<iCharacterSheetLogReport>;

	sourceType: LogSourceTypeNameUnion = 'Character Sheet';

	constructor(props: iBaseLoggerProps) {
		super(props);
		const toString = () => characterSheetLoggerToString(this);
		this.reporter = new LogReporter({ logger: this, describe: toString });
	}

	get report(): iCharacterSheetLogReport {
		const allTraitCollectionTraitReports: iTraitLogReport[] = this.getChildTraitCollectionReports().reduce(
			(accumulatedReports, collectionReports) => [...accumulatedReports, ...collectionReports.traitLogReports],
			[] as iTraitLogReport[]
		);

		return {
			sourceName: this.sourceName,
			sourceType: this.sourceType,
			events: [...this.events],
			traitLogReports: [...this.getChildTraitReports(), ...allTraitCollectionTraitReports],
			traitCollectionLogReports: this.getChildTraitCollectionReports(),
		};
	}

	createChildTraitCollectionLogger({ sourceName }: iChildLoggerCreatorProps): iTraitCollectionLogger {
		return createChildTraitCollectionLogger(sourceName, this.childTraitCollectionLoggers, (event: iLogEvent) =>
			this.log(event)
		);
	}

	createChildTraitLogger({ sourceName }: iChildLoggerCreatorProps): iTraitLogger {
		return createChildTraitLogger(sourceName, this.childTraitLoggers, (event: iLogEvent) => this.log(event));
	}

	protected getChildTraitCollectionReports(): iTraitCollectionLogReport[] {
		return Array.from(this.childTraitCollectionLoggers.values()).map(logger => logger.report);
	}

	protected getChildTraitReports(): iTraitLogReport[] {
		return Array.from(this.childTraitLoggers.values()).map(logger => logger.report);
	}
}

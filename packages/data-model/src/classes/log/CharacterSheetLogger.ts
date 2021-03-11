import { LogSourceTypeNameUnion } from '../../declarations/types';
import {
	iBaseLogReport,
	iCharacterSheetLogger,
	iCharacterSheetLogReport,
	iChildLoggerCreatorProps,
	iTraitCollectionLogger,
	iTraitCollectionLogReport,
	iTraitLogger,
	iTraitLogReport,
} from './../../declarations/interfaces/log-interfaces';
import AbstractLogger from './AbstractLogger';
import TraitCollecitonLogger from './TraitCollectionLogger';
import TraitLogger from './TraitLogger';

export default class CharacterSheetLogger
	extends AbstractLogger<iCharacterSheetLogReport>
	implements iCharacterSheetLogger {
	sourceType: LogSourceTypeNameUnion = 'Character Sheet';
	protected childTraitLoggers = new Map<string, iTraitLogger>();

	protected childTraitCollectionLoggers = new Map<string, iTraitCollectionLogger>();

	createChildTraitLogger(props: iChildLoggerCreatorProps): iTraitLogger {
		return new TraitLogger({ ...props, parentLogHandler: this.log });
	}
	createChildTraitCollectionLogger(props: iChildLoggerCreatorProps): iTraitCollectionLogger {
		return new TraitCollecitonLogger({ ...props, parentLogHandler: this.log });
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

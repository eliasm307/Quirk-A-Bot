import { LogSourceTypeNameUnion } from '../../declarations/types';
import { iTraitLogReport, iTraitLogger, iLogEvent } from './../../declarations/interfaces/log-interfaces';
import AbstractLogger from './AbstractLogger';

export default class TraitLogger extends AbstractLogger<iTraitLogReport> implements iTraitLogger {
	sourceType: LogSourceTypeNameUnion = 'Trait';

	get report(): iTraitLogReport {
		return {
			events: [...this.events],
			sourceName: this.sourceName,
			sourceType: this.sourceType,
		};
	}
}

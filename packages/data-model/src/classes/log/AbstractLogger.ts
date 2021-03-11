import {
	iBaseLogger,
	iBaseLogReport,
	iBaseLoggerProps,
	iBaseLogReporter,
} from '../../declarations/interfaces/log-interfaces';
import { iLogEvent } from '../../declarations/interfaces/log-interfaces';
import {} from '../../declarations/interfaces/trait-interfaces';
import { LogSourceTypeNameUnion } from '../../declarations/types';

export default abstract class AbstractLogger<L extends iBaseLogReport> implements iBaseLogger<L> {
	protected sourceName: string;
	protected parentLogHandler: ((event: iLogEvent) => void) | null;
	abstract readonly sourceType: LogSourceTypeNameUnion;
	readonly events: iLogEvent[] = [];
	abstract get reporter(): iBaseLogReporter<L>;
	abstract get report(): L;
	constructor({ sourceName, parentLogHandler }: iBaseLoggerProps) {
		this.sourceName = sourceName;
		this.parentLogHandler = parentLogHandler; 
	}

	getLogEvents(): iLogEvent[] {
		return [...this.events];
	}

	log(event: iLogEvent): void {
		this.events.push(event);

		// emit log to parent, if handler provided
		if (this.parentLogHandler) this.parentLogHandler(event);
	}
}

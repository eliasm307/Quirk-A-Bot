import { iBaseLogger, iBaseLogReport, iLoggerProps } from '../../declarations/interfaces/log-interfaces';
import { iLogEvent } from '../../declarations/interfaces/log-interfaces';
import {} from '../../declarations/interfaces/trait-interfaces';
import { LogSourceTypeNameUnion } from '../../declarations/types';

export default abstract class AbstractLogger<L extends iBaseLogReport> implements iBaseLogger<L> {
	protected sourceName: string;
	protected parentLogHandler: ((event: iLogEvent) => void) | null;
	abstract readonly sourceType: LogSourceTypeNameUnion;

	abstract readonly logEvents: iLogEvent[];
	abstract readonly report: L;
	constructor({ sourceName, parentLogHandler }: iLoggerProps) {
		this.sourceName = sourceName;
		this.parentLogHandler = parentLogHandler;
	}

	getLogEvents(): iLogEvent[] {
		return [...this.logEvents];
	}

	log(event: iLogEvent): void {
		this.logEvents.push(event);

		// emit log to parent, if handler provided
		if (this.parentLogHandler) this.parentLogHandler(event);
	}
}

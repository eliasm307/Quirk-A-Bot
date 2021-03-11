import {
  iBaseLogger, iBaseLoggerProps, iBaseLogReport, iBaseLogReporter, iLogEvent
} from '../../declarations/interfaces/log-interfaces';
import { LogSourceTypeNameUnion } from '../../declarations/types';

export default abstract class AbstractLogger<L extends iBaseLogReport> implements iBaseLogger<L> {
  protected parentLogHandler: ((event: iLogEvent) => void) | null;
  protected sourceName: string;

  readonly events: iLogEvent[] = [];
  abstract readonly reporter: iBaseLogReporter<L>;
  abstract readonly sourceType: LogSourceTypeNameUnion;

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

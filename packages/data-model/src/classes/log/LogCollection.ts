import { iLogReport, iLogCollectionProps } from './../../declarations/interfaces/log-interfaces';
import { iLogCollection, iLogEvent } from '../../declarations/interfaces/log-interfaces';
import {} from '../../declarations/interfaces/trait-interfaces';
import { LogSourceType } from '../../declarations/types';

export default class LogCollection implements iLogCollection {
	#logs: iLogEvent[] = [];
	#sourceName: string;
	#sourceType: LogSourceType;

	constructor({ sourceName, sourceType }: iLogCollectionProps) {
		this.#sourceName = sourceName;
		this.#sourceType = sourceType;
	}
	getLogEvents(): iLogEvent[] {
		return [...this.#logs];
	}

	log(event: iLogEvent): void {
		this.#logs.push(event);
	}
	getReport(): iLogReport {
		return {
			logEvents: this.getLogEvents(),
			sourceName: this.#sourceName,
			sourceType: this.#sourceType,
		};
	}
}

import { iLogReport, iLogCollectionProps } from './../../declarations/interfaces/log-interfaces';
import { iLogCollection, iLogEvent } from '../../declarations/interfaces/log-interfaces';
import { LogInitialValueDynamic, LogNewValueDynamic, LogOperationUnion, LogSourceType } from '../../declarations/types';
import {} from '../../declarations/interfaces/trait-interfaces';

export default class LogCollection implements iLogCollection {
	#logs: iLogEvent[] = [];
	#sourceName: string;
	#sourceType: LogSourceType;

	constructor({ sourceName, sourceType }: iLogCollectionProps) {
		this.#sourceName = sourceName;
		this.#sourceType = sourceType;
	}

	log(event: iLogEvent): void {
		this.#logs.push(event);
	}
	toJson(): iLogReport {
		return {
			logEvents: [...this.#logs],
			sourceName: this.#sourceName,
			sourceType: this.#sourceType,
		};
	} 
}

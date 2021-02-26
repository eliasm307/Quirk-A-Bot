import { iLogCollection, iLogEvent } from '../../declarations/interfaces/log-interfaces';
import { LogInitialValue, LogNewValue, LogOperation } from '../../declarations/types';
import { } from './../../declarations/interfaces';

export default class LogCollection<T> implements iLogCollection  {
	#logs: iLogEvent[] = [];

	log(event: iLogEvent): void {
		this.#logs.push(event);
	}
	toJson(): iLogEvent[] {
		return [...this.#logs];
	}
}

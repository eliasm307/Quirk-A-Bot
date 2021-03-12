import { iLogEvent, iTraitLogger } from '../interfaces/log-interfaces';
import TraitLogger from '../TraitLogger';

export default function createChildTraitLogger(
	sourceName: string,
	existingChildLoggers: Map<string, iTraitLogger>,
	parentLogHandler: (event: iLogEvent) => void
): iTraitLogger {
	// if a logger already exists return it
	const existingLogger = existingChildLoggers.get(sourceName);
	if (existingLogger) return existingLogger;

	// create a new logger
	const newLogger = new TraitLogger({ sourceName, parentLogHandler });

	// add new logger to existing loggers
	existingChildLoggers.set(sourceName, newLogger);

	return newLogger;
}

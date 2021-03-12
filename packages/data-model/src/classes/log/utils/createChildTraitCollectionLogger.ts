import { iLogEvent, iTraitCollectionLogger } from '../interfaces/log-interfaces';
import TraitCollectionLogger from '../TraitCollectionLogger';

export default function createChildTraitCollectionLogger(
	sourceName: string,
	existingChildLoggers: Map<string, iTraitCollectionLogger>,
	parentLogHandler: (event: iLogEvent) => void
): iTraitCollectionLogger {
	// if a logger already exists return it
	const existingLogger = existingChildLoggers.get(sourceName);
	if (existingLogger) return existingLogger;

	// create a new logger
	const newLogger = new TraitCollectionLogger({ sourceName, parentLogHandler });

	// add new logger to existing loggers
	existingChildLoggers.set(sourceName, newLogger);

	return newLogger;
}

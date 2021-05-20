import { pause } from '@quirk-a-bot/common';

export default async function returnValueWhenLoaded<T>(
  valueChecker: () => T | undefined,
  valueDescription: string // todo should be optional
): Promise<T> {
  // if it is already defined return it
  let value = valueChecker();
  if (value) {
    console.log(
      __filename,
      `returnValueWhenLoaded, value already loaded, returning`,
      { value, valueName: valueDescription }
    );
    return value;
  }

  let counter = 0;
  const maxWaitTimeMs = 2000;
  const checkIntervalMs = 100;

  // if this is being called just after instantiation, need to wait for collection observer to do initial data load
  while (counter < maxWaitTimeMs / checkIntervalMs) {
    value = valueChecker();
    if (value) {
      console.log(`${valueDescription} loaded, returning now`);
      return value;
    }

    console.warn(
      `${valueDescription} was not defined, waiting ${checkIntervalMs}ms then checking again...`
    );

    // eslint-disable-next-line no-await-in-loop
    await pause(checkIntervalMs);
    counter++;
  }

  throw Error(
    `Could not get ${valueDescription} because character data did not load in given time frame`
  );
}

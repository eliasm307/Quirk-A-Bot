export function getDateWithNanoSecondTimeStamp(): [Date, bigint] {
	const [seconds, nanoSeconds] = process.hrtime();

	const date = new Date();

	// NOTE this is relative to an arbritrary date, so it may not be an accurate time stamp when it is saved somewhere else and loaded to a different node process
	// const nanoSecondTimeStamp = process.hrtime.bigint();

	// timestamp relative to actual time
	const nanoSecondTimeStamp = BigInt(date.getTime()) * BigInt(1000) + BigInt(nanoSeconds);

	return [date, nanoSecondTimeStamp];
}

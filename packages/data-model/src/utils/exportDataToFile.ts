import fs, { WriteOptions } from 'fs-extra';

export default function exportDataToFile(data: any, outputFilePath: string): boolean {
	// todo account for if data is falsy
	// todo test

	const writeOptions: WriteOptions = {
		spaces: 2,
	};

	try {
		fs.ensureFileSync(outputFilePath); // ensure file path exists
		fs.writeJSONSync(outputFilePath, data, writeOptions); // write JSON to file path // todo replace with https://github.com/jprichardson/node-fs-extra/blob/master/docs/outputJson-sync.md

		// check file path exists
		if (fs.pathExistsSync(outputFilePath)) {
			console.log(__filename, `File: "${outputFilePath}" created successfully`); // log success
			return true;
		} else {
			console.error(__filename, `UNKNOWN ERROR creating File: "${outputFilePath}"`); // log error
			return false;
		}
	} catch (error) {
		console.error(__filename, `ERROR creating File: "${outputFilePath}"`, { error }); // log error
		return false;
	}
}

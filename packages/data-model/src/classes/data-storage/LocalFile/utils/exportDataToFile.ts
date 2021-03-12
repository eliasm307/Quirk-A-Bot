import fs, { WriteOptions } from 'fs-extra';
import path from 'path';

export default function exportDataToFile(data: any, outputFilePath: string): boolean { 
	// todo test

	if (!data || typeof data !== 'object' || (!Object.keys(data).length && !Array.isArray(data))) {
		console.error(__filename,`Data should be an object or an array`, { typeofData: typeof data, data });
		return false;
	}

	const resolvedOutputFilePath = path.resolve(outputFilePath);

	// console.log(__filename, { data, outputFilePath, resolvedOutputFilePath });

	const writeOptions: WriteOptions = {
		spaces: 2,
	};

	try {
		fs.ensureFileSync(resolvedOutputFilePath); // ensure file path exists
		fs.writeJSONSync(resolvedOutputFilePath, data, writeOptions); // write JSON to file path // todo replace with https://github.com/jprichardson/node-fs-extra/blob/master/docs/outputJson-sync.md

		// check file path exists
		if (fs.pathExistsSync(resolvedOutputFilePath)) {
			// console.log(__filename, `File: "${outputFilePath}" created successfully`); // log success
			return true;
		} else {
			console.error(__filename, `UNKNOWN ERROR creating File: "${resolvedOutputFilePath}"`); // log error
			return false;
		}
	} catch (error) {
		console.error(__filename, `ERROR creating File: "${resolvedOutputFilePath}"`, { error }); // log error
		return false;
	}
}

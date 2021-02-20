import fs, { ReadOptions } from 'fs-extra';

export default function importDataFromFile(filePath: string): any {
	// todo account for if data is falsy
	// todo test

	const readOptions: ReadOptions = { throws: true };

	try {
		const exists = fs.pathExistsSync(filePath); // check file path exists

		if (!exists) throw 'File does not exist.';
		const file = fs.readJSONSync(filePath, readOptions);
		console.log(__filename, `File: "${filePath}" read successfully`); // log success
		return file;
	} catch (error) {
		console.error(__filename, `ERROR reading File: "${filePath}"`, { error }); // log error
		return null;
	}
}

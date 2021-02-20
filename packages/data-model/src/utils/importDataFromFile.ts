import fs, { ReadOptions } from 'fs-extra';

export default async function importDataFromFile(filePath: string) {
	// todo account for if data is falsy
	// todo test

	const readOptions: ReadOptions = { throws: true };

	try {
		const exists = await fs.pathExists(filePath); // check file path exists

		if (!exists) throw 'File does not exist.';
		const file = await fs.readJSON(filePath, readOptions);
		console.log(__filename, `File: "${filePath}" read successfully`); // log success
		return file;
	} catch (error) {
		console.error(__filename, `ERROR reading File: "${filePath}"`, { error }); // log error
		return null;
	}
}

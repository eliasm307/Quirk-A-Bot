
import fs, { WriteOptions } from 'fs-extra';

export default function exportDataToFile( data: any, outputFilePath: string ): void {
  // todo account for if data is falsy
  
	const writeOptions: WriteOptions = {
		spaces: 2,
	};
	fs.ensureFile(outputFilePath) // ensure file path exists
		.then(_ => fs.writeJSON(outputFilePath, data, writeOptions)) // write JSON to file path
		.then(_ => console.log(__filename, `File: "${outputFilePath}" created successfully`)) // log success
		.catch(error => console.error(__filename, `ERROR creating File: "${outputFilePath}"`, { error })); // log error
}

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);

async function accessFile(path) {
	try {
		await fs.promises.access(path, fs.constants.F_OK);
		return true; // El archivo es accesible
	} catch (err) {
		console.log(err);
	}
}

async function readFile(file) {
	try {
		let result = await fs.promises.readFile(file, 'utf-8');
		let data = await JSON.parse(result);
		return data;
	} catch (err) {
		console.log(err);
	}
}

async function writeFile(file, data) {
	try {
		await fs.promises.writeFile(file, JSON.stringify(data));
		return true;
	} catch (err) {
		console.log(err);
	}
}

async function deleteFile(file) {
	try {
		await fs.promises.unlink(file);
		return true;
	} catch (err) {
		console.log(err);
	}
}

export default {
	// readFile,
	// writeFile,
	// deleteFile,
	// accessFile,
	__dirname,
	__fileName,
};

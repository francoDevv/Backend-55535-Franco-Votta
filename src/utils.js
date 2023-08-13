import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path'

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);

async function readFile(file) {
    try {
        let resultado = await fs.promises.readFile(file, 'utf-8');
        let data = await JSON.parse(resultado);
        return data;
    } catch (error) {
        throw new Error(error, "readFile tiene un error");
    }    
}    

async function writeFile(file, data) {
    try {
        await fs.promises.writeFile(file, JSON.stringify(data));
        return true;
    } catch (error) {
        throw new Error(error, "writeFile tiene un error");
    }    
}    

async function deleteFile(file) {
    try {
        await fs.promises.unlink(file);
        return true;
    } catch (error) {
        throw new Error(error, "deleteFile tiene un error");
    }    
}    


export default { readFile, writeFile, deleteFile, __dirname };
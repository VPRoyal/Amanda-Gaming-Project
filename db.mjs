import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {Low} from 'lowdb'
import {JSONFile} from 'lowdb/node'

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
const Path=(file)=>{return join(currentDirPath, "database", file)}

// stats db configuration
console.log("Path: ",Path("parity.json"))
export const statsDB = new Low(new JSONFile(Path("stats.json")), {statsNow:{}, stats:[]})
await statsDB.read()

// parity db configuration
export const parityDB = new Low(new JSONFile(Path("parity.json")), {games:[]})
await parityDB.read()
// sapre db configuration
export const sapreDB = new Low(new JSONFile(Path("sapre.json")), {games:[]})
await sapreDB.read()
// becon db configuration
export const beconDB = new Low(new JSONFile(Path("becon.json")), {games:[]})
await beconDB.read()
// emerd db configuration
export const emerdDB = new Low(new JSONFile(Path("emerd.json")), {games:[]})
await emerdDB.read()
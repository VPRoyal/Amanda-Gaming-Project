import path from 'path'
import {LowSync} from 'lowdb'
import {JSONFileSync} from 'lowdb/node'

const Path=(file)=>{return path.join(__dirname, "database", file)}

// stats db configuration
export const statsDB = new LowSync(new JSONFileSync(Path("stats")), {statsNow:{}, stats:[]})


// parity db configuration
export const parityDB = new LowSync(new JSONFileSync(Path("parity")), {games:[]})

// sapre db configuration
export const sapreDB = new LowSync(new JSONFileSync(Path("sapre")), {games:[]})

// becon db configuration
export const beconDB = new LowSync(new JSONFileSync(Path("becon")), {games:[]})

// emerd db configuration
export const emerdDB = new LowSync(new JSONFileSync(Path("emerd")), {games:[]})

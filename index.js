import { parityDB, sapreDB, beconDB, emerdDB, statsDB } from "./db.mjs"
import axios from "axios"
const types={1:"parity", 2:"sapre", 3:"becon", 4:"emerd"}
const Fetch =async (project=1)=>{
    let {statsNow}=statsDB.data
    const URL = "https://wea.amanda.jewelry/api/project/game_now"
    const headers = {
        "token": "e700b02b-1b5a-42b4-a6d8-1e455004b3b0",
        "User-Agent": "PostmanRuntime/7.32.3",
        }
    let options={
        method:"POST",
        headers:headers,
        body:JSON.stringify({project_id:project})
    }
    try {
        const res = await axios.post(URL, {project_id:project}, {headers:headers})
        const game=res.data.data.game_history.list[0]
        statsNow.beginTime=game.begintime
        statsNow[types[project]]="Success"
        return game
    } catch (error) {
        console.log("There is an error fetching response")
        console.log(`Error: ${error}`)
        statsNow.error=true
        statsNow[types[project]]="Error"
        return null
    }
}
const main = async()=>{
    let {stats, statsNow}=statsDB.data
    const currentTime=Math.floor(Date.now()/1000)
    console.log("Getting game stats...")
    if (Object.keys(statsNow).length > 0){
        if (statsNow.beginTime==null)
        { return console.log("There is an error running the process")}
        if(statsNow.status) return console.log("System already running")
        else if((currentTime-statsNow.beginTime+360)<0) return console.log("Game is still running! No time to fetch.")
        stats.push(statsNow)
    }
    statsDB.data.statsNow={startTime:currentTime, endTime:null, status:true, beginTime:null, parity:"pending", sapre:"pending", becon:"pending", emerd:"pending", error:false}
    const parity=await Fetch(1)
    if (parity && parity.is_show===0) {
        parityDB.data.games.push(parity)
        await parityDB.write()
    }
    const sapre=await Fetch(2)
    if (sapre && sapre.is_show===0) {
        sapreDB.data.games.push(sapre)
        await sapreDB.write()
    }
    const becon=await Fetch(3)
    if (becon && becon.is_show===0) {
        beconDB.data.games.push(becon)
        await beconDB.write()
    }
    const emerd=await Fetch(4)
    if (emerd && emerd.is_show===0) {
        emerdDB.data.games.push(emerd)
        await emerdDB.write()
    }
    statsNow=statsDB.data.statsNow
    statsNow.endTime=Math.floor(Date.now()/1000)
    statsNow.status=false
    await statsDB.write()
    console.log("Completed stats update.")
}

(async ()=>{
 await main()
})()
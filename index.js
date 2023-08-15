import { parityDB, sapreDB, beconDB, emerdDB, statsDB} from "./db"
const types={1:"parity", 2:"sapre", 3:"becon", 4:"emerd"}
const Fetch =async (project=1)=>{
    const {statsNow}=statsDB.data
    const URL = "wea.amanda.jewelry/api/project/game_now"
    const headers = {
        "token": "dd04ca9d-9aac-4f54-9762-580b57e21570",
        "User-Agent": "PostmanRuntime/7.32.3",
        }
    let options={
        method:"POST",
        headers:headers,
        body:JSON.stringify({project_id:project})
    }
    fetch(URL,options)
    .then(res=>res.json())
    .then(data=>{
        const game=data.data.game_history.list[0]
        statsNow.beginTime=game.begintime
        statsDB.write()
        return game})
    .catch(err=>{
        console.log(`There is an error executing request.\nError: ${err}`)
        statsNow.error=true
        statsNow[types[project]]="Error"
        statsDB.write()
        return null
    })
}
const main = async()=>{
    const {stats, statsNow}=statsDB.data
    const currentTime=Math.floor(Date.now()/1000)
    console.log("Getting game stats...")
    if (statsNow){
        if (statsNow.beginTime===null)return console.log("There is an error running process")
        if(statsNow.status===true) return console.log("System already running")
        else if((currentTime-statsNow.beginTime+360)<0) return console.log("Game is still running! No time to fetch.")
    }
    stats.push(statsNow)
    statsNow={startTime:currentTime, endTime:null, status:true, beginTime:null, parity:"pending", sapre:"pending", becon:"pending", emerd:"pending", error:false}
    statsDB.write()

    const parity=await Fetch(1)
    if (parity && parityparity.is_show===0) {
        parityDB.data.games.push(parity)
        parityDB.write()
        statsNow.parity=true
    }
    const sapre=await Fetch(2)
    if (sapre && sapre.is_show===0) {
        sapreDB.data.games.push(sapre)
        sapreDB.write()
        statsNow.sapre=true
    }
    const becon=await Fetch(3)
    if (becon && becon.is_show===0) {
        beconDB.data.games.push(becon)
        beconDB.write()
        statsNow.becon=true
    }
    const emerd=await Fetch(4)
    if (emerd && emerd.is_show===0) {
        emerdDB.data.games.push(emerd)
        emerdDB.write()
        statsNow.emerd=true
    }
    statsNow.endTime=Math.floor(Date.now()/1000)
    statsNow.status=false
    statsDB.write()
    console.log("Completed stats update.")
}
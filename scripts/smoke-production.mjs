import assert from 'node:assert/strict'
import {randomBytes,randomUUID} from 'node:crypto'
const base=process.env.OCTOQUIZ_URL??'https://octoquiz.octolabs.app'
const code=[...randomBytes(6)].map(n=>String.fromCharCode(65+n%26)).join('')
const clients=[]
const wait=ms=>new Promise(r=>setTimeout(r,ms))
async function until(fn){const end=Date.now()+10000;while(!fn()){if(Date.now()>end)throw Error('Relay timeout');await wait(10)}return fn()}
async function connect(){const ws=new WebSocket(base.replace(/^http/,'ws')+'/realtime/'+code),messages=[];clients.push(ws);ws.addEventListener('message',e=>messages.push(JSON.parse(e.data)));await until(()=>ws.readyState===WebSocket.OPEN);return {ws,messages,send:data=>ws.send(JSON.stringify(data))}}
try{
 assert.equal(await fetch(base+'/healthz').then(r=>r.text()),'ok')
 const host=await connect(),player=await connect(),stranger=await connect()
 const hostId=randomUUID(),id=randomUUID()
 host.send({type:'presence_track',payload:{role:'host',hostId}})
 await until(()=>player.messages.some(m=>m.type==='presence'))
 player.send({type:'presence_track',payload:{role:'player',id,name:'Release verification',avatar:'🦊',color:'#39644d'}})
 await until(()=>host.messages.some(m=>m.newPresences?.some(p=>p.id===id)))
 const marker=randomUUID()
 player.send({type:'broadcast',event:'game_state',payload:{marker}})
 stranger.send({type:'broadcast',event:'room_state',payload:{marker}})
 await wait(300)
 assert(!host.messages.some(m=>m.payload?.marker===marker))
 player.send({type:'broadcast',event:'player_action',payload:{playerId:'spoof',action:{type:'flag_answer',answer:'France'}}})
 const answer=await until(()=>host.messages.find(m=>m.event==='player_action'))
 assert.equal(answer.payload.playerId,id)
 host.send({type:'broadcast',event:'room_state',payload:{code,status:'lobby',players:[{id}]}})
 assert.equal((await until(()=>player.messages.find(m=>m.event==='room_state'))).payload.code,code)
 console.log('PASS production relay: host/player presence, state delivery, role enforcement and sender identity')
}finally{for(const ws of clients)ws.close()}

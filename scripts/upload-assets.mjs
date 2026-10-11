// Direct-upload helper for connector-based deployments. Tokens arrive on stdin,
// never in command arguments or repository files. Normal releases use Wrangler.
import {readFile,readdir,stat} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {createInterface} from 'node:readline'
import path from 'node:path'

const files=new Map(),manifest={}
async function visit(dir){
 for(const entry of await readdir(dir)){
  const file=path.join(dir,entry)
  if((await stat(file)).isDirectory()){await visit(file);continue}
  const data=await readFile(file),hash=createHash('sha256').update(data).digest('hex').slice(0,32)
  const name='/'+path.relative('out',file).split(path.sep).join('/')
  manifest[name]={hash,size:data.length};files.set(hash,{name,data})
 }
}
await visit('out')
if(process.argv[2]==='manifest'){process.stdout.write(JSON.stringify({manifest}));process.exit(0)}
const input=createInterface({input:process.stdin,terminal:false})
let config
for await(const line of input){config=JSON.parse(line);break}
input.close()
const mime={'.html':'text/html','.txt':'text/plain','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.json':'application/json'}
let completion=config.buckets.length?null:config.jwt
for(const bucket of config.buckets){
 const form=new FormData()
 for(const hash of bucket){
  const {name,data}=files.get(hash)
  form.append(hash,new Blob([data.toString('base64')],{type:mime[path.extname(name)]??'application/octet-stream'}),hash)
 }
 const response=await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.account}/workers/assets/upload?base64=true`,{method:'POST',headers:{Authorization:`Bearer ${config.jwt}`},body:form})
 const result=await response.json()
 if(!response.ok||!result.success)throw new Error(JSON.stringify({status:response.status,errors:result.errors}))
 if(result.result?.jwt)completion=result.result.jwt
}
if(!completion)throw new Error('No completion token returned')
process.stdout.write(JSON.stringify({jwt:completion,files:files.size}))
process.exit(0)

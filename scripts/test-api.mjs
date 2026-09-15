import http from 'node:http';
function fetch(url,options={}){return new Promise((resolve,reject)=>{const req=http.request(url,{method:options.method||'GET',headers:options.headers||{}},res=>{let text='';res.setEncoding('utf8');res.on('data',d=>text+=d);res.on('end',()=>resolve({status:res.statusCode,headers:{get:n=>{const v=res.headers[n];return Array.isArray(v)?v[0]:v}},json:()=>{try{return JSON.parse(text)}catch{return {error:text}}}}))});req.on('error',reject);if(options.body)req.write(options.body);req.end()})}
import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL||'http://localhost:3000';
let cookie='';
async function call(path,method='GET',payload,auth=false,origin=base){const r=await fetch(base+path,{method,headers:{...(auth?{cookie}:{}),...(method==='GET'?{}:{origin,'Content-Type':'application/json'})},body:payload===undefined?undefined:JSON.stringify(payload)});return {status:r.status,data:await r.json()}}
assert.equal((await call('/api/admin')).status,403);
assert.equal((await call('/api/admin','PUT',{})).status,403);
assert.equal((await call('/api/login','POST',{password:'wrong-test-password'})).status,401);
if(!process.env.TEST_ADMIN_PASSWORD)throw Error('Set TEST_ADMIN_PASSWORD to your local admin password.');
const signin=await fetch(base+'/api/login',{method:'POST',headers:{origin:base,'Content-Type':'application/json'},body:JSON.stringify({password:process.env.TEST_ADMIN_PASSWORD})});
assert.equal(signin.status,200,JSON.stringify(await signin.json()));
cookie=signin.headers.get('set-cookie').split(';')[0];
let admin=await call('/api/admin','GET',undefined,true);
assert.equal(admin.status,200,JSON.stringify(admin.data));
const original=structuredClone(admin.data.data);
const bad=structuredClone(original);bad.listings.find(x=>x.sample).verified=true;
assert.equal((await call('/api/admin','PUT',bad,true)).status,400);
assert.equal((await call('/api/admin','PUT',original,true,'https://bad.example')).status,403);
const changed=structuredClone(original);changed.listings.push({...changed.listings.find(x=>x.sample),id:'test-integration-contact',name:'Test contact',bn:'পরীক্ষা'});
let saved=await call('/api/admin','PUT',changed,true);assert.equal(saved.status,200,JSON.stringify(saved.data));
assert((await call('/api/directory')).data.listings.some(x=>x.id==='test-integration-contact'));
assert.equal((await call('/api/admin','PUT',changed,true)).status,409);
const report=await call('/api/reports','POST',{listingId:'test-integration-contact',reason:'wrong',details:'Automated integration test: wrong contact.'});
assert.equal(report.status,201,JSON.stringify(report.data));
admin=await call('/api/admin','GET',undefined,true);assert(admin.data.reports.some(x=>x.id===report.data.id));
assert.equal((await call('/api/admin','PATCH',{id:report.data.id,status:'resolved'},true)).status,200);
assert.equal((await call('/api/admin','PATCH',{id:report.data.id,status:'invalid'},true)).status,400);
assert.equal((await call('/api/reports','POST',{listingId:'missing',reason:'wrong',details:'Not a real listing.'})).status,404);
assert.equal((await call('/api/admin','PUT',{...original,revision:saved.data.revision},true)).status,200);
assert(!(await call('/api/directory')).data.listings.some(x=>x.id==='test-integration-contact'));
assert.equal((await call('/api/login','DELETE',undefined,true)).status,200);assert.equal((await call('/api/admin','GET',undefined,true)).status,403);console.log('18 API checks passed: password authentication, sign-out, origin checks, validation, persistent edits, concurrency, reports, review, and deletion.');






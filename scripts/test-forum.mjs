import assert from 'node:assert/strict';
import http from 'node:http';
const base=process.env.TEST_BASE_URL||'http://localhost:3000';let cookie='';
async function call(path,method='GET',body,admin=false){return new Promise((resolve,reject)=>{const req=http.request(base+path,{method,headers:{'Content-Type':'application/json',...(body!==undefined?{'Content-Length':Buffer.byteLength(JSON.stringify(body))}:{}),origin:base,...(admin?{cookie}:{})}},res=>{let text='';res.setEncoding('utf8');res.on('data',d=>text+=d);res.on('end',()=>{let data;try{data=JSON.parse(text)}catch{data={error:text}}resolve({status:res.statusCode,data,cookie:res.headers['set-cookie']?.[0]})})});req.on('error',reject);if(body!==undefined)req.write(JSON.stringify(body));req.end()})}
assert.equal((await call('/api/forum')).status,200);
assert.equal((await call('/api/forum')).data.canModerate,false);
assert.equal((await call('/api/forum','POST',{message:'short',number:''})).status,400);
assert.equal((await call('/api/forum','POST',{message:'a'.repeat(281),number:''})).status,400);
assert.equal((await call('/api/forum','POST',{message:'Please add this contact.',number:'invalid'})).status,400);
assert.equal((await call('/api/forum','DELETE',{id:'not-real'})).status,403);
if(!process.env.TEST_ADMIN_PASSWORD)throw Error('Set TEST_ADMIN_PASSWORD for the local admin.');
const signin=await call('/api/login','POST',{password:process.env.TEST_ADMIN_PASSWORD});assert.equal(signin.status,200);cookie=signin.cookie.split(';')[0];
assert.equal((await call('/api/forum','GET',undefined,true)).data.canModerate,true);
const posted=await call('/api/forum','POST',{message:'Local automated test suggestion; remove after verification.',number:''});
assert.equal(posted.status,201);
try{const feed=await call('/api/forum');const found=feed.data.posts.find(p=>p.id===posted.data.post.id);assert(found);assert.equal('fingerprint' in found,false)}
finally{assert.equal((await call('/api/forum','DELETE',{id:posted.data.post.id},true)).status,200)}
assert(!(await call('/api/forum')).data.posts.some(p=>p.id===posted.data.post.id));
assert.equal((await call('/api/login','DELETE',undefined,true)).status,200);
console.log('Forum checks passed: public posting, limits, persistence, privacy and admin-only removal. Test post removed.');




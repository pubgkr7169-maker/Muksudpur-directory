import {cookies} from 'next/headers';
import {createHash} from 'node:crypto';
import {readState,StoreError} from './store';
export async function getDirectory(){return (await readState()).directory}
export async function sha256(value:string){return createHash('sha256').update(value).digest('hex')}
export async function isAdmin(){const token=(await cookies()).get('muksudpur_admin')?.value;if(!token||!/^[a-f0-9]{64}$/.test(token))return false;try{return ((await readState()).private.sessions[await sha256(token)]||0)>Date.now()}catch{return false}}
export function json(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
export function failure(e:unknown){return e instanceof StoreError?json({error:e.message},e.status):json({error:'Unable to save. Please retry.'},503)}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');return !!origin&&origin===new URL(req.url).origin}
export async function body(req:Request){if(Number(req.headers.get('content-length'))>2000000)throw new StoreError('Request too large',413);const reader=req.body?.getReader();if(!reader)throw new StoreError('Empty request',400);let size=0;const chunks:Uint8Array[]=[];while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>2000000){await reader.cancel();throw new StoreError('Request too large',413)}chunks.push(value)}try{return JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{throw new StoreError('Invalid request',400)}}

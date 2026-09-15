import {getDirectory,json} from '../../../lib/server';
export async function GET(){try{return json(await getDirectory())}catch{return json({error:'Directory temporarily unavailable. Please retry.'},503)}}

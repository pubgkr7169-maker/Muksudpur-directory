import type {DirectoryData} from './data';
const safeUrl=(v:unknown)=>{if(v==='')return true;try{return typeof v==='string'&&new URL(v).protocol==='https:'}catch{return false}};
export function validateDirectory(v:unknown):asserts v is DirectoryData {
if(!v||typeof v!=='object')throw Error('Invalid directory');
const d=v as DirectoryData;
if(!Array.isArray(d.listings)||!Array.isArray(d.categories)||!Array.isArray(d.locations)||d.listings.length>5000||d.categories.length>100||d.locations.length>200)throw Error('Invalid directory size');
for(const [rows,kind] of [[d.listings,'listing'],[d.categories,'category'],[d.locations,'location']] as const){const ids=new Set<string>();for(const r of rows){if(!r||typeof r.id!=='string'||!/^[a-z0-9-]{1,80}$/.test(r.id)||ids.has(r.id))throw Error('Invalid or duplicate '+kind+' ID');ids.add(r.id);if(typeof r.name!=='string'||!r.name.trim()||r.name.length>150||typeof r.bn!=='string'||!r.bn.trim()||r.bn.length>150)throw Error('English and Bangla names are required');}}
if(!d.locations.some(x=>x.id==='nationwide'))throw Error('Nationwide location is required');
for(const l of d.listings){if(!d.categories.some(c=>c.id===l.category)||!d.locations.some(c=>c.id===l.location))throw Error('A listing uses a missing category or district');
for(const k of ['number','description','descriptionBn','verifiedAt','source','logo'] as const)if(typeof l[k]!=='string'||l[k].length>(k==='description'||k==='descriptionBn'?500:2048))throw Error('Invalid '+k);
if([l.sample,l.verified,l.pinned].some(x=>typeof x!=='boolean'))throw Error('Invalid listing flags');
if(!safeUrl(l.source)||!safeUrl(l.logo))throw Error('Source and logo must be HTTPS URLs');
if(!l.sample&&!/^\+?[0-9]{3,15}$/.test(l.number.replace(/[\s()-]/g,'')))throw Error('Enter a valid phone number, or mark it as a sample');
if(l.sample&&l.verified)throw Error('Sample listings cannot be verified');
if(l.verified&&(!/^\d{4}-\d{2}-\d{2}$/.test(l.verifiedAt)||!Number.isFinite(Date.parse(l.verifiedAt))||new Date(l.verifiedAt).toISOString().slice(0,10)!==l.verifiedAt||l.verifiedAt>new Date().toISOString().slice(0,10)||!l.source))throw Error('Verified listings require a valid past or current date and source URL');
}
for(const c of d.categories)if(typeof c.icon!=='string'||c.icon.length>30)throw Error('Invalid category icon');
}


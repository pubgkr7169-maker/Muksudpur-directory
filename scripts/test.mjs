import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import ts from 'typescript';
mkdirSync('work/tests',{recursive:true});
for(const name of ['data','validation']){const code=ts.transpileModule(readFileSync('lib/'+name+'.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;writeFileSync('work/tests/'+name+'.mjs',code)}
const {initialData,filterListings,callable}=await import('../work/tests/data.mjs');
const {validateDirectory}=await import('../work/tests/validation.mjs');
validateDirectory(initialData);
assert.equal(initialData.locations.length,2);
assert.equal(new Set(initialData.locations.map(x=>x.id)).size,2);
assert(initialData.listings.filter(x=>x.sample).every(x=>!callable(x)&&!x.verified));
assert(filterListings(initialData,'৯৯৯','','').some(x=>x.number==='999'));
assert(filterListings(initialData,'অ্যাম্বুলেন্স','','').length>0);
assert(filterListings(initialData,'','ambulance','muksudpur').every(x=>x.location==='muksudpur'||x.location==='nationwide'));
assert(filterListings(initialData,'','','muksudpur').some(x=>x.number==='999'));
assert.equal(filterListings(initialData,'','','',['fire-102']).length,1);
assert(filterListings(initialData,'','','',undefined,true).every(x=>x.verified&&!x.sample));
const invalid=structuredClone(initialData);invalid.listings.find(x=>x.sample).verified=true;assert.throws(()=>validateDirectory(invalid),/Sample/);
const future=structuredClone(initialData);future.listings[0].verifiedAt='2099-01-01';assert.throws(()=>validateDirectory(future),/valid past/);
const missing=structuredClone(initialData);missing.categories=missing.categories.filter(x=>x.id!=='police');assert.throws(()=>validateDirectory(missing),/missing category/);
const unsafe=structuredClone(initialData);unsafe.listings[0].logo='javascript:alert(1)';assert.throws(()=>validateDirectory(unsafe),/HTTPS/);
console.log('12 directory safety, search, Muksudpur scope and validation checks passed.');



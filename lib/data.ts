export type Category={id:string;name:string;bn:string;icon:string};
export type Location={id:string;name:string;bn:string};
export type Listing={id:string;name:string;bn:string;category:string;location:string;number:string;description:string;descriptionBn:string;sample:boolean;verified:boolean;verifiedAt:string;source:string;pinned:boolean;logo:string};
export type DirectoryData={listings:Listing[];categories:Category[];locations:Location[];revision:number};
export const categories:Category[]=[
['ambulance','Ambulance','অ্যাম্বুলেন্স','ambulance'],['fire','Fire service','ফায়ার সার্ভিস','flame'],['police','Police & emergency','পুলিশ ও জরুরি সেবা','shield'],['hospital','Hospitals','হাসপাতাল','hospital'],['blood','Blood banks','ব্লাড ব্যাংক','blood'],['isp','Internet / ISP','ইন্টারনেট / আইএসপি','wifi'],['electricity','Electricity','বিদ্যুৎ','zap'],['gas','Gas','গ্যাস','flame'],['water','Water','পানি','water'],['transport','Transport','পরিবহন','bus'],['bank','Banks','ব্যাংক','bank'],['mobile','Mobile operators','মোবাইল অপারেটর','mobile'],['government','Government','সরকারি সেবা','building']
].map(([id,name,bn,icon])=>({id,name,bn,icon}));
export const locations:Location[]=[{id:'nationwide',name:'National helpline',bn:'National helpline'},{id:'muksudpur',name:'Muksudpur',bn:'Muksudpur'}];
const police='https://police.portal.gov.bd/pages/static-pages/6922dcc4933eb65569e11ed9';
export const listings:Listing[]=[
{id:'emergency-999',name:'National Emergency Service',bn:'জাতীয় জরুরি সেবা',category:'police',number:'999',description:'Police, fire and ambulance assistance. Free, 24 hours.',descriptionBn:'পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স সহায়তা। বিনামূল্যে, ২৪ ঘণ্টা।',source:'https://telecom-police.portal.gov.bd/pages/static-pages/695e3b0cc4774958d7b72321',pinned:true},
{id:'fire-102',name:'Fire Service & Civil Defence',bn:'ফায়ার সার্ভিস ও সিভিল ডিফেন্স',category:'fire',number:'102',description:'National fire and rescue emergency hotline.',descriptionBn:'অগ্নিকাণ্ড ও উদ্ধার সহায়তার জাতীয় হটলাইন।',source:'https://fireservice.gov.bd/pages/static-pages/6922dfa7933eb65569e23441',pinned:true},
{id:'information-333',name:'Government Information Service',bn:'সরকারি তথ্য ও সেবা',category:'government',number:'333',description:'Information about government services.',descriptionBn:'সরকারি সেবার তথ্য ও সহায়তা।',source:police,pinned:true},
{id:'child-1098',name:'Child Helpline',bn:'শিশু সহায়তা',category:'government',number:'1098',description:'Support and assistance for children.',descriptionBn:'শিশুদের জন্য সহায়তা ও পরামর্শ।',source:police,pinned:false},
{id:'women-109',name:'Women & Children Helpline',bn:'নারী ও শিশু সহায়তা',category:'government',number:'109',description:'Help for women and children facing violence.',descriptionBn:'নির্যাতনের শিকার নারী ও শিশুদের সহায়তা।',source:police,pinned:false},
{id:'nid-105',name:'National ID Information',bn:'জাতীয় পরিচয়পত্র তথ্য',category:'government',number:'105',description:'National identity card information and assistance.',descriptionBn:'জাতীয় পরিচয়পত্র সংক্রান্ত তথ্য ও সহায়তা।',source:police,pinned:false},
].map(v=>({...v,location:'nationwide',sample:false,verified:true,verifiedAt:'2026-09-08',logo:''})).concat([
['ambulance','Muksudpur Community Ambulance'],
['hospital','Muksudpur Community Hospital'],
['blood','Muksudpur Blood Donor Network'],
['isp','Muksudpur Broadband Support'],
['electricity','Muksudpur Electricity Support'],
['gas','Muksudpur Gas Support'],
['water','Muksudpur Water Support'],
['transport','Muksudpur Transport Desk'],
['bank','Muksudpur Bank Customer Care'],
['mobile','Muksudpur Mobile Service Point']
].map(([category,name],i)=>({id:'sample-'+i,name,bn:name,category,location:'muksudpur',number:'01XXX-XXXXXX',description:'Sample contact for Muksudpur. A real number has not been added yet.',descriptionBn:'',sample:true,verified:false,verifiedAt:'',source:'',pinned:false,logo:''})));
export const initialData:DirectoryData={listings,categories,locations,revision:0};
export function normalize(v:string){return v.normalize('NFKC').toLowerCase().replace(/[০-৯]/g,c=>String('০১২৩৪৫৬৭৮৯'.indexOf(c))).replace(/[’']/g,'').replace(/\s+/g,' ').trim()}
export function filterListings(data:DirectoryData,q:string,category:string,location:string,saved?:string[],verifiedOnly=false){const terms=normalize(q).split(' ').filter(Boolean);return data.listings.filter(l=>(!category||l.category===category)&&(!location||l.location==='nationwide'||l.location===location)&&(!saved||saved.includes(l.id))&&(!verifiedOnly||l.verified&&!l.sample)&&terms.every(t=>normalize([l.name,l.bn,l.number,l.description,l.descriptionBn,data.categories.find(c=>c.id===l.category)?.name,data.categories.find(c=>c.id===l.category)?.bn,data.locations.find(c=>c.id===l.location)?.name,data.locations.find(c=>c.id===l.location)?.bn].join(' ')).includes(t))).sort((a,b)=>Number(b.pinned)-Number(a.pinned)||Number(a.sample)-Number(b.sample)||a.name.localeCompare(b.name))}
export function callable(l:Listing){return !l.sample&&/^\+?[0-9]{3,15}$/.test(l.number.replace(/[\s()-]/g,''))}
export function tel(l:Listing){return 'tel:'+l.number.replace(/[\s()-]/g,'')}




import {Phone,ShieldCheck} from 'lucide-react';
import {callable,tel,type DirectoryData} from '../lib/data';

function ServiceArt({kind}:{kind:string}){
  const medical=kind==='ambulance'||kind==='hospital';
  return <svg className="dial-art" viewBox="0 0 280 140" fill="none" aria-hidden="true">
    <ellipse cx="140" cy="128" rx="122" ry="7" fill="currentColor" opacity=".08"/>
    <path d="M40 123V52H101V30H192V65H238V123" fill="var(--art-wall)"/>
    <path d="M101 30H192V123H101Z" fill="var(--art-front)"/>
    <path d="M34 48H103M95 27H198M192 61H244" stroke="var(--art-roof)" strokeWidth="9"/>
    <path d="M113 44H181V62H113Z" fill="var(--art-glass)"/>
    <path d="M55 65H68V87H55ZM78 65H91V87H78ZM207 77H222V98H207Z" fill="var(--art-glass)"/>
    <path d="M121 81H175V124H121Z" fill="var(--art-roof)"/>
    <path d="M129 87H167V124H129Z" fill="var(--art-glass)"/>
    <path d="M148 87V124M129 105H167" stroke="var(--art-wall)" strokeWidth="3"/>
    {medical?<path d="M143 43H151V49H157V57H151V63H143V57H137V49H143Z" fill="var(--art-roof)"/>:kind==='police'?<path d="M147 42L157 46V54C157 61 147 66 147 66S137 61 137 54V46L147 42Z" fill="var(--art-roof)"/>:<path d="M148 41C160 54 151 54 158 61C158 69 136 69 136 60C136 53 145 51 148 41Z" fill="var(--art-roof)"/>}
    {kind==='hospital'?<g><path d="M27 123V97M252 123V93" stroke="var(--art-roof)" strokeWidth="5"/><ellipse cx="27" cy="96" rx="12" ry="23" fill="var(--art-tree)"/><ellipse cx="252" cy="94" rx="12" ry="25" fill="var(--art-tree)"/><path d="M14 125H46M235 125H267" stroke="var(--art-tree)" strokeWidth="8"/></g>:<g><path d="M180 109V86H219L237 107V124H177V109Z" fill="var(--art-vehicle)"/><path d="M215 91H220L232 106H215Z" fill="var(--art-glass)"/><path d="M175 113H239" stroke="var(--art-roof)" strokeWidth="4"/><path d="M195 83H208" stroke="var(--art-roof)" strokeWidth="5"/>{medical&&<path d="M193 94V107M187 100H200" stroke="var(--art-roof)" strokeWidth="4"/>}<circle cx="188" cy="124" r="8" fill="var(--art-roof)"/><circle cx="226" cy="124" r="8" fill="var(--art-roof)"/><circle cx="188" cy="124" r="3" fill="var(--art-wall)"/><circle cx="226" cy="124" r="3" fill="var(--art-wall)"/></g>}
  </svg>;
}

export function QuickDial({data,live}:{data:DirectoryData;live:boolean}){
  const services=[{kind:'police',title:'Police & emergency',fallback:'999'}, {kind:'fire',title:'Fire Service',fallback:'102'}, {kind:'ambulance',title:'Ambulance Service',fallback:'999'}, {kind:'hospital',title:'Muksudpur Health Services',fallback:''}];
  return <section className="quick-dial" id="emergency" aria-labelledby="quick-dial-title">
    <div className="dial-heading"><div><p className="dial-eyebrow">IMPORTANT NUMBERS</p><h2 id="quick-dial-title">Quick dial</h2></div><p>Find your service. Tap to call.</p></div>
    <div className="dial-grid">{services.map(s=>{
      const local=live?data.listings.filter(l=>l.category===s.kind&&l.location==='muksudpur'&&l.verified&&callable(l)).sort((a,b)=>Number(b.pinned)-Number(a.pinned)||a.name.localeCompare(b.name))[0]:undefined;
      const number=local?.number||s.fallback;
      const description=local?'Verified local contact':s.kind==='ambulance'?'Request ambulance assistance through 999':number?'National helpline · Available in Muksudpur':'A verified local number has not been added yet.';
      return <article className={'dial-card dial-'+s.kind} key={s.kind}>
        <h3>{local?.name||s.title}</h3><ServiceArt kind={s.kind}/><p className="dial-description">{description}</p>
        <div className="dial-actions"><strong>{number||'Coming soon'}</strong>{number?<a href={local?tel(local):'tel:'+number} aria-label={'Call '+(local?.name||s.title)+' '+number}><Phone size={20}/> Call now</a>:<span className="dial-unavailable">Not available</span>}</div>
        {local&&<p className="dial-verified"><ShieldCheck size={14}/> Source checked · <time dateTime={local.verifiedAt}>{local.verifiedAt}</time></p>}
      </article>;
    })}</div>
    <p className="dial-note">For an immediate emergency, call <a href="tel:999">999</a>. National helplines are shown when no verified local contact is available.</p>
  </section>;
}


import {initializeApp,getApps} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js';
import {getAuth,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';

const config={apiKey:"AIzaSyCHrFPytJh3voKVEV1ZZdgcwTyOCl03dNY",authDomain:"lecture-entre-les-lignes.firebaseapp.com",projectId:"lecture-entre-les-lignes",appId:"1:876044393565:web:da359169bccbfc709081b4"};
export const auth=getAuth(getApps()[0]||initializeApp(config));
export const onAccount=callback=>onAuthStateChanged(auth,callback);
export async function requestService(action, fields={}, account){
  await auth.authStateReady();
  account??=auth.currentUser;
  if(!account||auth.currentUser?.uid!==account.uid)throw Error('Connecte-toi pour continuer.');
  const token=await account.getIdToken();
  if(auth.currentUser?.uid!==account.uid)throw Error('Le compte a changé. Réessaie.');
  const response=await fetch('https://cezgcoaokwuobipwfffa.supabase.co/functions/v1/secure-account',{
    method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},
    body:JSON.stringify({action,...fields})
  });
  const data=await response.json();
  if(!response.ok)throw Error(data.error||'Service temporairement indisponible.');
  return data;
}
export async function uploadAttachment(file,fileType,account){
  if(!file?.size)return '';
  const mime=fileType==='pdf'?'application/pdf':file.type;
  const {path,token}=await requestService('requests-upload',{fileType,mime},account);
  const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  const client=createClient('https://cezgcoaokwuobipwfffa.supabase.co','sb_publishable_rT-YdocnvHDGqRpwF1Zvkg_EGs_bjj3',{auth:{persistSession:false}});
  const {error}=await client.storage.from('book-request-files').uploadToSignedUrl(path,token,file,{contentType:mime});
  if(error)throw error;
  return path;
}

export const labels={pending:'En attente',validated:'Validée',unresolved:'Non traitée'};
export function requestCard(record,{admin=false,account}={}){
  const node=document.createElement('article');
  node.className=admin?'admin-request':'request-entry';
  const add=(tag,value)=>{const element=document.createElement(tag);element.textContent=value;node.append(element);return element;};
  add('h3',record.title);
  add('p',labels[record.status]||labels.pending).className='status '+(labels[record.status]?record.status:'pending');
  if(record.author)add('p',record.author);
  if(admin&&record.requester_email)add('p',record.requester_email);
  const detailLabels={genre:'Genre',subgenre:'Sous-genre',edition:'Édition',publicationDate:'Parution',price:'Prix',isbn:'ISBN',referenceUrl:'Référence',summary:'Résumé',details:'Informations complémentaires'};
  for(const [key,label] of Object.entries(detailLabels)){
    if(record.details?.[key])add('p',label+' · '+record.details[key]);
  }
  for(const [field,fileType,label] of [['cover_path','cover','Voir la couverture'],['pdf_path','pdf','Ouvrir le PDF joint']]){
    if(!record[field])continue;
    const button=add('button',label);
    button.type='button';
    button.onclick=async()=>{
      button.disabled=true;
      try{
        const {url}=await requestService('requests-file',{id:record.id,fileType},account);
        const link=document.createElement('a');
        link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=label;
        button.replaceWith(link);
      }catch(error){add('p',error.message);button.disabled=false;}
    };
  }
  if(record.admin_message)add('p',record.admin_message).className='response';
  return node;
}

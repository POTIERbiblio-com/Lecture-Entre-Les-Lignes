import {auth,requestService} from './request-service.js';
const project='https://cezgcoaokwuobipwfffa.supabase.co';
const publicKey='sb_publishable_rT-YdocnvHDGqRpwF1Zvkg_EGs_bjj3';
export async function catalogueRules(){
  const response=await fetch(project+'/rest/v1/catalogue_moderation?select=book_id,access_level,pending_access_level,hidden,deleted',{
    headers:{apikey:publicKey},cache:'no-store'
  });
  if(!response.ok)throw Error('Le statut du catalogue est indisponible.');
  return new Map((await response.json()).map(rule=>[rule.book_id,rule]));
}
export async function cataloguePdf(bookId,{download=false,publicAccess=false}={}){
  const args={bookId,purpose:download?'download':'read'};
  let url;
  if(publicAccess){
    const response=await fetch(project+'/functions/v1/secure-account',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'catalogue-public-pdf',...args})});
    const result=await response.json();
    if(!response.ok)throw Error(result.error||'PDF indisponible.');
    url=result.url;
  }else ({url}=await requestService('catalogue-pdf',args));
  const signed=new URL(url);
  if(signed.origin!==project||!signed.pathname.startsWith('/storage/v1/object/sign/book-pdfs/'))throw Error('Lien de lecture invalide.');
  return signed.href;
}
export async function uploadCataloguePdf(bookId,file,account=auth.currentUser){
  if(!file?.size||await file.slice(0,5).text()!=='%PDF-')throw Error('Sélectionne un PDF valide.');
  const {path,token}=await requestService('catalogue-pdf-upload',{bookId},account);
  const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  const client=createClient(project,publicKey,{auth:{persistSession:false}});
  const {error}=await client.storage.from('book-pdfs').uploadToSignedUrl(path,token,file,{contentType:'application/pdf'});
  if(error)throw error;
  await requestService('catalogue-pdf-activate',{bookId,path,rightsAttested:true},account);
}

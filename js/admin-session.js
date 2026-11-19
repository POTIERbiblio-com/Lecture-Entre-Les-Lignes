import { sendEmailVerification } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
import { auth,onAccount,requestService } from './request-service.js';

const administrators=new Set(['quentinmorel1912@gmail.com','juliepotier2006@gmail.com']);
export function watchAdministration({status,onReady,onClosed}){
 let run=0,readyUid=null;
 const returnPage=location.pathname.split('/').at(-1);
 const login=()=> 'connexion-firebase.html?retour='+encodeURIComponent(returnPage);
 const link=(label)=>{
  const element=document.createElement('a');
  element.href=login();element.textContent=label;
  status.append(' ',element);
 };
 const action=(label,callback)=>{
  const button=document.createElement('button');button.type='button';button.className='btn secondary';button.textContent=label;
  button.onclick=callback;status.append(' ',button);
  return button;
 };
 async function check(account){
  const turn=++run;
  if(!account||readyUid!==account.uid){readyUid=null;onClosed();}
  if(!account){status.textContent='Aucune session Entre les lignes sur cette page.';link('Se connecter');return;}
  const email=account.email?.trim().toLowerCase();
  if(!administrators.has(email)){status.textContent='Compte connecté · '+(email||'adresse inconnue')+'. Choisis ton compte administrateur.';link('Changer de compte');return;}
  status.textContent='Vérification de la session de '+email+'…';
  try{
   await account.reload();
   if(turn!==run||auth.currentUser?.uid!==account.uid)return;
   if(!account.emailVerified){
    status.textContent='Tu es bien connecté avec '+email+'. Confirme cette adresse pour ouvrir l’atelier.';
    const send=action('Envoyer le lien de vérification',async()=>{
      send.disabled=true;
      try{
       const returnUrl=new URL(login(),location.href);
       try{await sendEmailVerification(account,{url:returnUrl.href});}
       catch(error){if(error.code!=='auth/unauthorized-continue-uri')throw error;await sendEmailVerification(account);}
       if(turn===run)status.firstChild.textContent='Lien envoyé à '+email+'. Ouvre-le, puis reviens ici.';
      }catch(error){if(turn===run)status.firstChild.textContent='Envoi impossible ('+(error.code||'erreur réseau')+').';}
      finally{send.disabled=false;}
    });
    action('J’ai validé mon adresse',()=>check(account));
    return;
   }
   await account.getIdToken(true);
   const {subscription}=await requestService('status',{},account);
   if(turn!==run||auth.currentUser?.uid!==account.uid)return;
   if(!subscription.admin){status.textContent='Adresse vérifiée, mais le serveur n’accorde pas le rôle administrateur.';return;}
   const changed=readyUid!==account.uid;
   readyUid=account.uid;
   await onReady(account,changed,()=>turn===run&&auth.currentUser?.uid===account.uid);
  }catch(error){
   if(turn===run&&auth.currentUser?.uid===account.uid){
    status.textContent='Impossible de vérifier le compte · '+error.message;
    action('Réessayer',()=>check(account));
   }
  }
 }
 onAccount(check);
 window.addEventListener('focus',()=>{if(!readyUid&&auth.currentUser)void check(auth.currentUser);});
 return ()=>check(auth.currentUser);
}